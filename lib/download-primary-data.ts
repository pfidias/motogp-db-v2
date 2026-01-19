'use server';

import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { URL } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';
import { requireAdmin } from './require-admin';
import Season from '@/app/models/season';
import GP from '@/app/models/gp';
import { type GP as GPType } from '@/lib/validation';

let hasSPR2 = false;
let hasRAC2 = false;

const execPromise = promisify(exec);

type DownloadResult = {
  pdfPath: string;
  txtPath: string | null;
};

type FailedUrl = {
  url: string;
  reason: string;
};

type MultipleDownloadResult = {
  downloadedFiles: DownloadResult[];
  failedUrls: FailedUrl[];
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
};

const isValidUrl = (url: string) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch (error) {
    return false;
  }
};

// assumes a non 200 response means no RAC2
const setHasRAC2 = async (year: number, code: string) => {
  const response = await fetch(
    `https://resources.motogp.com/files/results/${year}/${code}/MotoGP/RAC2/Classification.pdf`,
  );

  hasRAC2 = response.status === 200;
};
const setHasSPR2 = async (year: number, code: string) => {
  const response = await fetch(
    `https://resources.motogp.com/files/results/${year}/${code}/MotoGP/SPR2/Classification.pdf`,
  );

  hasSPR2 = response.status === 200;
};

const extractTextFromPDF = async (
  pdfPath: string,
  txtPath: string,
): Promise<{ success: boolean }> => {
  try {
    console.log('Extracting text from PDF...');
    console.log(`Saving to: ${txtPath}`);

    await execPromise(`
      PDF_PATH="$(pwd)/${pdfPath}"
      TXT_PATH="$(pwd)/${txtPath}"

      osascript <<EOF
      set pdfFile to POSIX file "$PDF_PATH"
      set outFile to "$TXT_PATH"

      tell application "Adobe Acrobat"
          activate
          open pdfFile
      end tell

      delay 2

      tell application "System Events"
          keystroke "a" using command down
          keystroke "c" using command down
      end tell

      delay 1

      do shell script "pbpaste > " & quoted form of outFile

      tell application "Adobe Acrobat"
          close document 1
      end tell
      EOF`);

    const stats = fs.statSync(txtPath);
    console.log(
      `✓ Extraction complete! Size: ${stats.size.toLocaleString()} bytes`,
    );
    return { success: true };
  } catch (error) {
    console.error(
      `✗ Failed to extract text from PDF: ${(error as Error).message}`,
    );
    throw error;
  }
};

const downloadFile = (url: string, dest: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const options = {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
      },
    };

    const file = fs.createWriteStream(dest);

    protocol
      .get(url, options, (response) => {
        // redirect handling
        if (response.statusCode === 301 || response.statusCode === 302) {
          file.close();
          fs.unlinkSync(dest);
          downloadFile(response.headers.location as string, dest)
            .then(resolve)
            .catch(reject);
          return;
        }

        // handle 404 errors
        if (response.statusCode === 404) {
          file.close();
          fs.unlinkSync(dest);
          reject(new Error(`File not found (404): ${url}`));
          return;
        }

        // handle other HTTP errors
        if (response.statusCode !== 200) {
          file.close();
          fs.unlinkSync(dest);
          reject(
            new Error(
              `HTTP error: ${response.statusCode}: ${response.statusMessage}`,
            ),
          );
          return;
        }

        response.pipe(file);

        file.on('finish', () => {
          file.close();
          resolve();
        });
      })
      .on('error', (err) => {
        if (fs.existsSync(dest)) {
          fs.unlinkSync(dest);
        }
        reject(err);
      });
    file.on('error', (err) => {
      if (fs.existsSync(dest)) {
        fs.unlinkSync(dest);
      }
      reject(err);
    });
  });
};

export const downloadSingle = async (
  url: string,
  outputDir: string = '../motogp_downloads',
): Promise<DownloadResult | null> => {
  const { error } = await requireAdmin();
  if (error) {
    throw new Error(error);
  }

  const isRAC = url.includes('RAC/');
  const isSPR = url.includes('SPR/');

  try {
    if (!isValidUrl(url)) {
      console.error(`✗ Invalid URL: ${url}`);
      return null;
    }

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const parsedUrl = new URL(url);
    // const filename = path.basename(parsedUrl.pathname);
    const code = parsedUrl.pathname.match(/[A-Z]{3}(?=\/MotoGP)/)?.[0];
    const pdfName = `${parsedUrl.pathname
      .match(/(?<=MotoGP\/).+/)?.[0]
      .replace('RAC/', isRAC && hasRAC2 ? 'RAC1/' : 'RAC/')
      .replace('SPR/', isSPR && hasSPR2 ? 'SPR1/' : 'SPR/')
      .replace(/\//g, ' ')}`;
    const txtName = `${code} ${pdfName.replace(/\.pdf$/i, '.txt')}`;

    const pdfPath = path.join(outputDir, pdfName);
    const txtPath = path.join(outputDir, txtName);

    console.log(`Downloading: ${url}`);
    console.log(`Saving to: ${pdfPath}`);

    await downloadFile(url, pdfPath);

    const stats = fs.statSync(pdfPath);
    console.log(
      `✓ Download complete! Size: ${stats.size.toLocaleString()} bytes`,
    );

    const result: DownloadResult = { pdfPath, txtPath: null };

    try {
      const { success } = await extractTextFromPDF(pdfPath, txtPath);

      if (success) {
        result.txtPath = txtPath;
      }
    } catch (error) {
      console.error(
        `✗ Failed to extract text from PDF: ${(error as Error).message}`,
      );
    }

    return result;
  } catch (error) {
    // Check if it's a 404 error
    if ((error as Error).message.includes('Not Found (404)')) {
      console.error(`✗ File not found (404): ${url}`);
    } else {
      console.error(`✗ Download failed: ${(error as Error).message}`);
    }
    return null;
  }
};

export const downloadMultiple = async (
  urls: string[],
  outputDir: string = '../motogp_downloads',
): Promise<MultipleDownloadResult> => {
  const downloadedFiles: DownloadResult[] = [];
  const failedUrls: FailedUrl[] = [];

  for (const [i, url] of urls.entries()) {
    console.log(`\n[${i + 1}/${urls.length}] Processing...`);

    if (!isValidUrl(url)) {
      console.error(`✗ Skipping invalid URL: ${url}`);
      failedUrls.push({ url, reason: 'Invalid URL format' });
      continue;
    }

    try {
      const result = await downloadSingle(url, outputDir);
      if (result) {
        downloadedFiles.push(result);
      } else {
        failedUrls.push({
          url,
          reason: 'Download failed (check logs for details)',
        });
      }
    } catch (error) {
      if ((error as Error).message.includes('Not Found (404)')) {
        console.log(`✗ Skipping - File not found (404): ${url}`);
        failedUrls.push({ url, reason: 'File not found (404)' });
      } else {
        console.error(`✗ Error processing ${url}: ${(error as Error).message}`);
        failedUrls.push({
          url,
          reason: (error as Error).message,
        });
      }

      continue;
    }
  }
  console.log('\n' + '='.repeat(90));
  console.log(
    `Summary: ${downloadedFiles.length}/${urls.length} files downloaded successfully`,
  );

  if (failedUrls.length > 0) {
    console.log(`\nFailed URLs (${failedUrls.length}):`);
    failedUrls.forEach(({ url, reason }) => {
      console.log(`✗ Failed: ${url}`);
      console.log(` - Reason: ${reason}`);
    });
  }
  console.log('='.repeat(90));

  return {
    downloadedFiles,
    failedUrls,
    summary: {
      total: urls.length,
      successful: downloadedFiles.length,
      failed: failedUrls.length,
    },
  };
};

export const downloadPrimaryData = async () => {
  const currentYear = new Date().getFullYear();
  const year = currentYear - 1;

  // in final version, we would first check if the GP exists for the given year
  const [{ gp_id }] = await GP.find<GPType>({ year })
    .sort({ gp_id: -1 })
    .limit(1)
    .select('gp_id -_id');

  // in final version, we would first check if an event exists for the given year and gp id (which is gp_id + 1)
  const [{ code }] = await Season.aggregate<{ code: string }>([
    {
      $match: {
        year,
      },
    },
    {
      $unwind: {
        path: '$gps',
      },
    },
    {
      $match: {
        'gps.gp_id': gp_id - 10,
      },
    },
    {
      $set: {
        rcd_id: '$gps.rcd_id',
      },
    },
    {
      $lookup: {
        from: 'codes',
        localField: 'rcd_id',
        foreignField: 'rcd_id',
        as: 'code_lu',
      },
    },
    {
      $set: {
        code: {
          $getField: {
            field: 'code',
            input: {
              $first: '$code_lu',
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        code: 1,
      },
    },
  ]);

  // set the globals
  await setHasSPR2(year, code);
  await setHasRAC2(year, code);

  const dir = `../Primary Data/${year}/${code}`;

  const urls = [
    `https://resources.motogp.com/files/results/${year}/${code}/MotoGP/FP1/Analysis.pdf`,
    `https://resources.motogp.com/files/results/${year}/${code}/MotoGP/PR/Analysis.pdf`,
    `https://resources.motogp.com/files/results/${year}/${code}/MotoGP/FP2/Analysis.pdf`,
    `https://resources.motogp.com/files/results/${year}/${code}/MotoGP/Q1/Analysis.pdf`,
    `https://resources.motogp.com/files/results/${year}/${code}/MotoGP/Q2/Analysis.pdf`,
    `https://resources.motogp.com/files/results/${year}/${code}/MotoGP/SPR/Analysis.pdf`,
    `https://resources.motogp.com/files/results/${year}/${code}/MotoGP/SPR2/Analysis.pdf`,
    `https://resources.motogp.com/files/results/${year}/${code}/MotoGP/WUP/Analysis.pdf`,
    `https://resources.motogp.com/files/results/${year}/${code}/MotoGP/RAC/Analysis.pdf`,
    `https://resources.motogp.com/files/results/${year}/${code}/MotoGP/RAC2/Analysis.pdf`,

    `https://resources.motogp.com/files/results/${year}/${code}/MotoGP/FP1/Classification.pdf`,
    `https://resources.motogp.com/files/results/${year}/${code}/MotoGP/PR/Classification.pdf`,
    `https://resources.motogp.com/files/results/${year}/${code}/MotoGP/FP2/Classification.pdf`,
    `https://resources.motogp.com/files/results/${year}/${code}/MotoGP/Q1/Classification.pdf`,
    `https://resources.motogp.com/files/results/${year}/${code}/MotoGP/Q2/Classification.pdf`,
    `https://resources.motogp.com/files/results/${year}/${code}/MotoGP/SPR/Classification.pdf`,
    `https://resources.motogp.com/files/results/${year}/${code}/MotoGP/SPR2/Classification.pdf`,
    `https://resources.motogp.com/files/results/${year}/${code}/MotoGP/WUP/Classification.pdf`,
    `https://resources.motogp.com/files/results/${year}/${code}/MotoGP/RAC/Classification.pdf`,
    `https://resources.motogp.com/files/results/${year}/${code}/MotoGP/RAC2/Classification.pdf`,

    `https://resources.motogp.com/files/results/${year}/${code}/MotoGP/SPR/Grid.pdf`,
    `https://resources.motogp.com/files/results/${year}/${code}/MotoGP/SPR2/Grid.pdf`,
    `https://resources.motogp.com/files/results/${year}/${code}/MotoGP/RAC/Grid.pdf`,
    `https://resources.motogp.com/files/results/${year}/${code}/MotoGP/RAC2/Grid.pdf`,

    `https://resources.motogp.com/files/results/${year}/${code}/MotoGP/SPR/Session.pdf`,
    `https://resources.motogp.com/files/results/${year}/${code}/MotoGP/SPR2/Session.pdf`,
    `https://resources.motogp.com/files/results/${year}/${code}/MotoGP/RAC/Session.pdf`,
    `https://resources.motogp.com/files/results/${year}/${code}/MotoGP/RAC2/Session.pdf`,
  ];

  return await downloadMultiple(urls, dir);
};

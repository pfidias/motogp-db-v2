import { redirect } from 'next/navigation';
import Season from '@/app/models/season';
import GPSelector from './gp-selector';
import { requireAdmin } from '@/lib/require-admin';

type GPSelector = {
  code: string;
  downloaded: boolean;
  from: Date;
};

const DownloadPrimaryDataPage = async () => {
  const { error } = await requireAdmin();
  if (error) {
    redirect('/not-authorized');
  }

  const gps = await Season.aggregate<GPSelector>([
    // {
    //   $match: {
    //     year: 2025,
    //   },
    // },
    {
      $sort: {
        year: -1,
      },
    },
    {
      $limit: 1,
    },
    {
      $unwind: {
        path: '$gps',
      },
    },
    {
      $lookup: {
        from: 'gps',
        localField: 'gps.gp_id',
        foreignField: 'gp_id',
        as: 'gp_lu',
      },
    },
    {
      $lookup: {
        from: 'codes',
        localField: 'gps.rcd_id',
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
        downloaded: {
          $cond: {
            if: {
              $gt: [
                {
                  $size: '$gp_lu',
                },
                0,
              ],
            },
            then: true,
            else: false,
          },
        },
        from: '$gps.from',
      },
    },
    {
      $project: {
        _id: 0,
        code: 1,
        downloaded: 1,
        from: 1,
      },
    },
  ]);

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 px-12">
      {gps.map((gp, i) => {
        return (
          <GPSelector
            key={gp.code}
            code={gp.code}
            downloaded={gp.downloaded}
            from={gp.from}
            index={i + 1}
          />
        );
      })}
    </div>
  );
};

export default DownloadPrimaryDataPage;

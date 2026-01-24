'use client';
import {
  Card,
  CardTitle,
  CardAction,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaCheckCircle } from 'react-icons/fa';
import { downloadPrimaryData } from '@/app/actions/download-primary-data';

type Props = {
  code: string;
  downloaded: boolean;
  from: Date;
  index: number;
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const GPSelector = ({ code, downloaded, from, index }: Props) => {
  const startDate = new Date(
    from.getFullYear(),
    from.getMonth(),
    from.getUTCDate(),
  );
  const hasCompleted = startDate < new Date();

  return (
    <Card className="w-full border border-gray-200 shadow-md">
      <CardTitle className="flex items-center justify-between px-4 pt-4">
        <span className="text-3xl font-bold text-zinc-700">{code}</span>
        <CardAction>
          {downloaded && <FaCheckCircle className="text-3xl text-green-500" />}
        </CardAction>
      </CardTitle>
      <CardContent>
        <p className="text-sm text-zinc-700/80">
          {dateFormatter.format(startDate)}
        </p>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={!hasCompleted}
          onClick={() => downloadPrimaryData(from.getFullYear(), code, index)}
        >
          {downloaded ? 'Redownload' : 'Download'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GPSelector;

import { Schema, model, models } from 'mongoose';
import { Season as SeasonType } from '@/lib/validation';

const season_schema = new Schema<SeasonType>({
  year: Number,
  gps: [
    {
      from: Date,
      to: Date,
      gp_id: Number,
      rcd_id: Number,
    },
  ],
});

const Season = models.Season || model<SeasonType>('Season', season_schema);

export default Season;

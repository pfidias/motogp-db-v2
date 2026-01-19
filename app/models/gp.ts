import { Schema, model, models } from 'mongoose';
import { GP as GPType } from '@/lib/validation';

const gp_schema = new Schema<GPType>({
  gp_id: Number,
  date: Date,
  date_start: Date,
  date_end: Date,
  ct_id: Number,
  rcd_id: Number,
  year: Number,
  venue: String,
});

const GP = models.GP || model<GPType>('GP', gp_schema);

export default GP;

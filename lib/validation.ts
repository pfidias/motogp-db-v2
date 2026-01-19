import z, { coerce } from 'zod';

export const passwordSchema = z
  .string()
  .min(1, { message: 'Password is required' })
  .min(8, { message: 'Password must be at least 8 characters' })
  .regex(/[^A-Za-z0-9]/, {
    message: 'Password must contain at least one special character',
  });

export const SeasonSchema = z.object({
  year: z
    .number()
    .int()
    .positive()
    .min(2014, 'Year must be at least 2014')
    .max(
      new Date().getFullYear(),
      'Year must be less than or equal to the current year',
    ),
  gps: z.array(
    z.object({
      from: z.coerce.date(),
      to: z.coerce.date(),
      gp_id: z.number().int().positive(),
      rcd_id: z.number().int().positive(),
    }),
  ),
});
export type Season = z.infer<typeof SeasonSchema>;

export const GPSchema = z.object({
  gp_id: z.number().int().positive().max(1000),
  venue: z.string().nonempty(),
  ct_id: z.number().int().positive().max(1000),
  rcd_id: z.number().int().positive().max(1000),
  date_start: z.coerce.date(),
  date_end: z.coerce.date(),
  date: z.coerce.date(),
  year: z.number().int().positive().min(2014).max(new Date().getFullYear()),
});
export type GP = z.infer<typeof GPSchema>;

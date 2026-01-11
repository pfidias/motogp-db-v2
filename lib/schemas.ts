import z from 'zod';

export const generalFormSchema = z.object({
  name: z.string().optional(),
  country: z.string().optional(),
  dob: z.date().optional(),
  height: z.number().optional(),
  weight: z.number().optional(),
  riderImage: z.string().optional().nullable(),
  flagImage: z.string().optional().nullable(),
  teamImage: z.string().optional().nullable(),
  actionImage: z.string().optional().nullable(),
});

export type GeneralFormValues = z.infer<typeof generalFormSchema>;

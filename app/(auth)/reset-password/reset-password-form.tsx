'use client';

import { LoadingButton } from '@/components/loading-button';
import { PasswordInput } from '@/components/password-input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { authClient } from '@/lib/auth-client';
import { passwordSchema } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'react-hot-toast';

const resetPasswordSchema = z
  .object({
    newPassword: passwordSchema,
    passwordConfirmation: z
      .string()
      .min(1, { message: 'Please confirm password' }),
  })
  .refine((data) => data.newPassword === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', passwordConfirmation: '' },
  });

  async function onSubmit({ newPassword }: ResetPasswordValues) {
    setSuccess(null);
    setError(null);

    const { error } = await authClient.resetPassword({
      newPassword,
      token,
    });

    if (error) {
      toast.error(error.message || 'Something went wrong');
    } else {
      toast.success('Password has been reset. You can now sign in.');
      setTimeout(() => router.push('/sign-in'), 2000);
      form.reset();
    }
  }

  const loading = form.formState.isSubmitting;

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      className="placeholder:text-muted-foreground/50 placeholder:text-xs md:text-xs"
                      autoComplete="new-password"
                      placeholder="Enter new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      className="placeholder:text-muted-foreground/50 placeholder:text-xs md:text-xs"
                      autoComplete="new-password"
                      placeholder="Confirm new password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {success && (
              <div role="status" className="text-foreground text-sm">
                {success}
              </div>
            )}
            {error && (
              <div role="alert" className="text-destructive text-sm">
                {error}
              </div>
            )}

            <LoadingButton type="submit" className="w-full" loading={loading}>
              Reset password
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

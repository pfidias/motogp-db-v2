import { Resend } from 'resend';
import {
  EmailVerification,
  EmailChangeApproval,
  PasswordReset,
} from '@/components/email';

const resend = new Resend(process.env.RESEND_API_KEY!);

type EmailData = {
  to: string;
  subject: string;
  url: string;
  name: string;
  type?: 'verification' | 'approval' | 'reset';
};

export async function sendEmail({
  to,
  subject,
  url,
  name,
  type = 'verification',
}: EmailData) {
  const firstName = name ? name.split(' ')[0] : 'friend';
  await resend.emails.send({
    from: 'admin@motogpdb.com',
    to,
    subject,
    react:
      type === 'approval'
        ? EmailChangeApproval({ firstName, link: url })
        : type === 'reset'
          ? PasswordReset({ firstName, link: url })
          : EmailVerification({ firstName, link: url }),
  });
}

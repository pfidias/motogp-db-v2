import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { type AuthContext } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { APIError, createAuthMiddleware } from 'better-auth/api';
// import { client, db, connectMongoDB } from './mongo-client';
import { connectMongoose, mongoose } from './mongoose';
import { sendEmail } from '@/lib/email';
import { passwordSchema } from './validation';

// await connectMongoose();
// await connectMongoDB();
const instance: typeof mongoose = await connectMongoose();
const client = instance.connection.getClient();
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  async onRequest(request: Request, ctx: AuthContext) {
    console.log('onRequest:', request.url);
    await connectMongoose();
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  emailAndPassword: {
    enabled: true,
    // if true, we cannot set up a re-send verification link flow because there is no user session
    // requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      sendEmail({
        to: user.email,
        name: user.name,
        subject: 'Reset your password',
        url,
        type: 'reset',
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        name: user.name,
        subject: 'Verify your email',
        url,
      });
    },
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user, newEmail, url }) => {
        await sendEmail({
          to: user.email, // send to old email for security
          name: user.name,
          subject: 'Approve new email address',
          url,
          type: 'approval',
        });
      },
      requireVerification: true,
    },
    additionalFields: {
      role: {
        type: 'string',
        required: true,
        defaultValue: 'basic',
        input: false,
      },
    },
  },
  account: {
    accountLinking: {
      // https://www.youtube.com/watch?v=N4meIif7Jtc around time 3:41:00
      enabled: false,
    },
  },
  plugins: [nextCookies()],
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (
        ctx.path === '/sign-up/email' ||
        ctx.path === '/reset-password' ||
        ctx.path === '/change-password'
      ) {
        const password = ctx.body.password || ctx.body.newPassword;
        if (password) {
          const { error } = passwordSchema.safeParse(password);
          if (error) {
            throw new APIError('BAD_REQUEST', {
              // message: 'Password does not meet criteria',
              message: error.issues[0].message,
            });
          }
        }
      }
    }),
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;

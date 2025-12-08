import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db'; // your drizzle instance
export const auth = betterAuth({
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      mapProfileToUser: profile => {
        return {
          handle: profile.login, // "login" is the handle in GitHub's API
        };
      },
    },
  },
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
  user: {
    additionalFields: {
      handle: { type: 'string' },
      isAdmin: { type: 'boolean' },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  advanced: {
    database: {
      generateId: 'uuid',
    },
  },
});

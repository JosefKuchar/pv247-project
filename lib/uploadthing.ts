import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { auth } from './auth';
import { headers } from 'next/headers';

const f = createUploadthing();

export const ourFileRouter = {
  reviewImageUploader: f({
    image: {
      maxFileSize: '32MB',
      maxFileCount: 10,
    },
  })
    .middleware(async () => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session?.user) {
        throw new Error('Unauthorized');
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);
      console.log('File URL:', file.ufsUrl);

      return { url: file.ufsUrl };
    }),

  profileImageUploader: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session?.user) {
        throw new Error('Unauthorized');
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Profile image upload complete for userId:', metadata.userId);
      console.log('File URL:', file.ufsUrl);

      return { url: file.ufsUrl };
    }),

  // Public uploader for registration (no auth required)
  registrationImageUploader: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // No auth required for registration
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      console.log('Registration image upload complete');
      console.log('File URL:', file.ufsUrl);

      return { url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

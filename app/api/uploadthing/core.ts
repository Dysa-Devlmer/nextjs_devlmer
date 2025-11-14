import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const f = createUploadthing();

export const ourFileRouter = {
  productImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);

      if (!session || session.user.role !== 'ADMIN') {
        throw new Error('No autorizado');
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);
      console.log('File URL:', file.url);

      return { uploadedBy: metadata.userId, url: file.url };
    }),

  ticketAttachment: f({ image: { maxFileSize: '4MB', maxFileCount: 3 } })
    .middleware(async () => {
      const session = await getServerSession(authOptions);

      if (!session) {
        throw new Error('No autorizado');
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);
      console.log('File URL:', file.url);

      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

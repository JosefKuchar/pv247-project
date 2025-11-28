'use server';

import { zfd } from 'zod-form-data';
import { z } from 'zod';
import { v7 as uuidv7 } from 'uuid';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { authActionClient } from '@/lib/safe-action';
import { db } from '@/db';
import { review, reviewPhoto } from '@/db/schema';

const createReviewSchema = zfd.formData({
  locationId: zfd.text(z.string().min(1, 'Location is required')),
  description: zfd.text(z.string().min(1, 'Description is required')),
  rating: zfd.numeric(z.number().min(1).max(5)),
  photos: zfd.repeatableOfType(zfd.file()).optional(),
});

export const createReview = authActionClient
  .inputSchema(createReviewSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { locationId, description, rating, photos } = parsedInput;
    const userId = (ctx as { userId: string }).userId;

    // Verify location exists
    const locationExists = await db.query.location.findFirst({
      where: (location, { eq }) => eq(location.id, locationId),
    });

    if (!locationExists) {
      throw new Error('Location not found');
    }

    // Create review
    const reviewId = uuidv7();
    await db.insert(review).values({
      id: reviewId,
      userId,
      locationId,
      description,
      rating,
    });

    // Handle file uploads if provided
    const photoUrls: string[] = [];
    if (photos && photos.length > 0) {
      // Ensure uploads directory exists
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'reviews');
      await mkdir(uploadsDir, { recursive: true });

      // Process each uploaded photo
      for (const photo of photos) {
        const fileExtension = photo.name.split('.').pop() || 'jpg';
        const fileName = `${uuidv7()}.${fileExtension}`;
        const filePath = join(uploadsDir, fileName);

        // Convert File to Buffer and save
        const bytes = await photo.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // Generate URL for the saved file
        const photoUrl = `/uploads/reviews/${fileName}`;
        photoUrls.push(photoUrl);
      }

      // Create review photos records
      if (photoUrls.length > 0) {
        const photoRecords = photoUrls.map(url => ({
          id: uuidv7(),
          reviewId,
          url,
        }));

        await db.insert(reviewPhoto).values(photoRecords);
      }
    }

    return {
      success: true,
      reviewId,
    };
  });

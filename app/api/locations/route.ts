import { db } from '@/db';
import { location, review } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const locations = await db.select().from(location);

    const reviews = await db.select().from(review);

    const locationRatings: Record<string, { sum: number; count: number }> = {};
    for (const r of reviews) {
      if (!locationRatings[r.locationId]) {
        locationRatings[r.locationId] = { sum: 0, count: 0 };
      }
      locationRatings[r.locationId].sum += r.rating;
      locationRatings[r.locationId].count += 1;
    }

    const locationsWithRating = locations.map(loc => ({
      ...loc,
      averageRating: locationRatings[loc.id]?.count
        ? locationRatings[loc.id].sum / locationRatings[loc.id].count
        : null,
    }));

    return NextResponse.json(locationsWithRating);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 },
    );
  }
}

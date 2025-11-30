import { db } from '@/db';
import { location } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const locations = await db.select().from(location);
    return NextResponse.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 },
    );
  }
}

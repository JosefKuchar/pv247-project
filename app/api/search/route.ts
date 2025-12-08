import { db } from '@/db';
import { location, user } from '@/db/schema';
import { sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ locations: [], users: [] });
  }

  const escapedQuery = query.toLowerCase().replace(/[%_]/g, '\\$&');

  const searchTerm = `%${escapedQuery}%`;

  const locations = await db
    .select({
      id: location.id,
      name: location.name,
      handle: location.handle,
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
    })
    .from(location)
    .where(
      sql`lower(${location.name}) like ${searchTerm} or lower(${location.address}) like ${searchTerm}`,
    )
    .limit(10);

  const users = await db
    .select({
      id: user.id,
      name: user.name,
      handle: user.handle,
      image: user.image,
    })
    .from(user)
    .where(
      sql`lower(${user.name}) like ${searchTerm} or lower(${user.handle}) like ${searchTerm}`,
    )
    .limit(10);

  return NextResponse.json({ locations, users });
}

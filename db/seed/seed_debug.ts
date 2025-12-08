import 'dotenv/config';
import { randomUUID } from 'crypto';
import { db } from '../index';
import {
  user,
  location,
  review,
  reviewPhoto,
  reviewLike,
  comment,
  follow,
  userLocationFollow,
  locationManagement,
} from '../schema';

async function main() {
  console.log('🌱 Seeding database...');

  try {
    // Clear existing data (in reverse order of dependencies)
    console.log('Clearing existing data...');
    await db.delete(locationManagement);
    await db.delete(userLocationFollow);
    await db.delete(follow);
    await db.delete(comment);
    await db.delete(reviewLike);
    await db.delete(reviewPhoto);
    await db.delete(review);
    await db.delete(location);
    await db.delete(user);

    // Create users
    console.log('Creating users...');
    const users = [
      {
        id: randomUUID(),
        name: 'Alice Johnson',
        email: 'alice@example.com',
        handle: 'alicejohnson',
        description:
          '☕ Coffee enthusiast and digital nomad. Love discovering cozy cafés and sharing great spots with fellow travelers.',
        emailVerified: true,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
      },
      {
        id: randomUUID(),
        name: 'Bob Smith',
        email: 'bob@example.com',
        handle: 'bobsmith',
        description:
          '🍕 Foodie on a mission to find the best restaurants in the city. Always up for trying new cuisines!',
        emailVerified: true,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
      },
      {
        id: randomUUID(),
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        handle: 'charliebrown',
        description:
          "🥾 Adventure seeker and nature lover. When I'm not hiking, you can find me planning my next outdoor expedition.",
        emailVerified: true,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
      },
      {
        id: randomUUID(),
        name: 'Diana Prince',
        email: 'diana@example.com',
        handle: 'dianaprince',
        description:
          '🎨 Art curator and culture enthusiast. I believe art has the power to transform communities and inspire change.',
        emailVerified: true,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diana',
      },
      {
        id: randomUUID(),
        name: 'Eve Wilson',
        email: 'eve@example.com',
        handle: 'evewilson',
        description:
          "🏖️ Beach lover and wellness advocate. Life's too short not to enjoy the simple pleasures by the ocean.",
        emailVerified: true,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eve',
      },
      {
        id: randomUUID(),
        name: 'Frank Miller',
        email: 'frank@example.com',
        handle: 'frankmiller',
        description:
          '💻 Tech entrepreneur and startup mentor. Passionate about innovation and building communities for creators.',
        emailVerified: true,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=frank',
      },
    ];

    await db.insert(user).values(users);
    const [alice, bob, charlie, diana, eve, frank] = users;

    // Create locations
    console.log('Creating locations...');
    const locations = [
      {
        id: randomUUID(),
        name: 'Central Park Café',
        description:
          'A charming neighborhood café serving artisanal coffee and fresh pastries. Perfect for remote work with reliable WiFi and cozy seating areas.',
        address: '123 Main St, New York, NY 10001',
        latitude: 40.7589,
        longitude: -73.9851,
        handle: 'central-park-cafe',
      },
      {
        id: randomUUID(),
        name: 'Riverside Restaurant',
        description:
          'Elegant dining with stunning river views. Features seasonal Italian cuisine, an extensive wine list, and outdoor terrace seating.',
        address: '456 River Rd, New York, NY 10002',
        latitude: 40.7614,
        longitude: -73.9776,
        handle: 'riverside-restaurant',
      },
      {
        id: randomUUID(),
        name: 'Mountain View Hiking Trail',
        description:
          'Scenic 3-mile hiking trail offering breathtaking panoramic views of the city skyline. Moderate difficulty with well-marked paths.',
        address: '789 Trail Way, New York, NY 10003',
        latitude: 40.7505,
        longitude: -73.9934,
        handle: 'mountain-view-hiking-trail',
      },
      {
        id: randomUUID(),
        name: 'Downtown Art Gallery',
        description:
          'Contemporary art gallery featuring rotating exhibitions from emerging and established artists. Free admission on Sundays.',
        address: '321 Art Ave, New York, NY 10004',
        latitude: 40.7282,
        longitude: -73.9942,
        handle: 'downtown-art-gallery',
      },
      {
        id: randomUUID(),
        name: 'Seaside Beach',
        description:
          'Beautiful sandy beach with crystal clear waters. Family-friendly with lifeguards on duty, beach volleyball courts, and snack bars.',
        address: '555 Ocean Blvd, New York, NY 10005',
        latitude: 40.6892,
        longitude: -74.0445,
        handle: 'seaside-beach',
      },
      {
        id: randomUUID(),
        name: 'Tech Hub Co-working Space',
        description:
          'Modern co-working space designed for entrepreneurs and creatives. Features high-speed internet, meeting rooms, and networking events.',
        address: '999 Innovation St, New York, NY 10006',
        latitude: 40.7489,
        longitude: -73.968,
        handle: 'tech-hub-co-working-space',
      },
    ];

    await db.insert(location).values(locations);
    const [cafe, restaurant, trail, gallery, beach, coworking] = locations;

    // Create reviews
    console.log('Creating reviews...');
    const reviews = [
      {
        id: randomUUID(),
        userId: alice.id,
        locationId: cafe.id,
        description:
          'Amazing coffee and cozy atmosphere! Perfect spot for morning work sessions. The baristas are friendly and the pastries are fresh.',
        rating: 5,
      },
      {
        id: randomUUID(),
        userId: bob.id,
        locationId: cafe.id,
        description:
          'Good coffee but a bit crowded during peak hours. WiFi is reliable though.',
        rating: 4,
      },
      {
        id: randomUUID(),
        userId: charlie.id,
        locationId: restaurant.id,
        description:
          'Excellent food and service! The pasta was incredible. Highly recommend the tiramisu for dessert.',
        rating: 5,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: restaurant.id,
        description:
          'Nice ambiance but the food took a while to arrive. The wine selection is impressive.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: eve.id,
        locationId: trail.id,
        description:
          'Beautiful hiking trail with stunning views! Great for a weekend adventure. Bring water and good shoes.',
        rating: 5,
      },
      {
        id: randomUUID(),
        userId: frank.id,
        locationId: trail.id,
        description:
          'Moderate difficulty trail. The view at the top is worth the climb. Watch out for loose rocks.',
        rating: 4,
      },
      {
        id: randomUUID(),
        userId: alice.id,
        locationId: gallery.id,
        description:
          'Incredible art collection! The contemporary pieces are thought-provoking. Free entry on Sundays.',
        rating: 5,
      },
      {
        id: randomUUID(),
        userId: bob.id,
        locationId: beach.id,
        description:
          'Perfect beach for a day out! Clean sand and clear water. Parking can be tricky on weekends.',
        rating: 4,
      },
      {
        id: randomUUID(),
        userId: charlie.id,
        locationId: coworking.id,
        description:
          'Great workspace with fast internet and comfortable seating. The community events are a nice bonus.',
        rating: 5,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },

      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },

      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },

      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },

      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },

      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },

      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },

      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },

      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
      {
        id: randomUUID(),
        userId: diana.id,
        locationId: coworking.id,
        description:
          'Good facilities but can get noisy. The meeting rooms are well-equipped though.',
        rating: 3,
      },
    ];

    await db.insert(review).values(reviews);
    const [review1, , review3, , review5, , review7, review8, review9] =
      reviews;

    // Create review photos
    console.log('Creating review photos...');
    await db.insert(reviewPhoto).values([
      {
        id: randomUUID(),
        reviewId: review1.id,
        url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800',
      },
      {
        id: randomUUID(),
        reviewId: review1.id,
        url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800',
      },
      {
        id: randomUUID(),
        reviewId: review3.id,
        url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      },
      {
        id: randomUUID(),
        reviewId: review5.id,
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      },
      {
        id: randomUUID(),
        reviewId: review7.id,
        url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
      },
      {
        id: randomUUID(),
        reviewId: review8.id,
        url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      },
    ]);

    // Create review likes
    console.log('Creating review likes...');
    await db.insert(reviewLike).values([
      { id: randomUUID(), reviewId: review1.id, userId: bob.id },
      { id: randomUUID(), reviewId: review1.id, userId: charlie.id },
      { id: randomUUID(), reviewId: review1.id, userId: diana.id },
      { id: randomUUID(), reviewId: review3.id, userId: alice.id },
      { id: randomUUID(), reviewId: review3.id, userId: eve.id },
      { id: randomUUID(), reviewId: review5.id, userId: bob.id },
      { id: randomUUID(), reviewId: review5.id, userId: frank.id },
      { id: randomUUID(), reviewId: review7.id, userId: charlie.id },
      { id: randomUUID(), reviewId: review7.id, userId: eve.id },
      { id: randomUUID(), reviewId: review9.id, userId: alice.id },
      { id: randomUUID(), reviewId: review9.id, userId: bob.id },
    ]);

    // Create comments
    console.log('Creating comments...');
    await db.insert(comment).values([
      {
        id: randomUUID(),
        reviewId: review1.id,
        userId: bob.id,
        content: 'I totally agree! Their cappuccino is the best in town.',
      },
      {
        id: randomUUID(),
        reviewId: review1.id,
        userId: charlie.id,
        content: 'Thanks for the tip! Will check it out this weekend.',
      },
      {
        id: randomUUID(),
        reviewId: review3.id,
        userId: alice.id,
        content: 'The tiramisu sounds amazing! Adding this to my list.',
      },
      {
        id: randomUUID(),
        reviewId: review5.id,
        userId: diana.id,
        content: 'How long did the hike take you?',
      },
      {
        id: randomUUID(),
        reviewId: review5.id,
        userId: eve.id,
        content: 'About 2-3 hours depending on your pace. Worth every minute!',
      },
      {
        id: randomUUID(),
        reviewId: review7.id,
        userId: frank.id,
        content: 'The Sunday free entry is a great deal!',
      },
    ]);

    // Create follows (user-to-user)
    console.log('Creating user follows...');
    await db.insert(follow).values([
      { id: randomUUID(), followerId: bob.id, followingId: alice.id },
      { id: randomUUID(), followerId: charlie.id, followingId: alice.id },
      { id: randomUUID(), followerId: diana.id, followingId: alice.id },
      { id: randomUUID(), followerId: alice.id, followingId: bob.id },
      { id: randomUUID(), followerId: eve.id, followingId: bob.id },
      { id: randomUUID(), followerId: charlie.id, followingId: diana.id },
      { id: randomUUID(), followerId: frank.id, followingId: eve.id },
    ]);

    // Create user location follows
    console.log('Creating location follows...');
    await db.insert(userLocationFollow).values([
      { id: randomUUID(), userId: alice.id, locationId: cafe.id },
      { id: randomUUID(), userId: bob.id, locationId: cafe.id },
      { id: randomUUID(), userId: charlie.id, locationId: restaurant.id },
      { id: randomUUID(), userId: diana.id, locationId: trail.id },
      { id: randomUUID(), userId: eve.id, locationId: gallery.id },
      { id: randomUUID(), userId: frank.id, locationId: coworking.id },
    ]);

    // Create location management (some approved, some pending)
    console.log('Creating location management...');
    await db.insert(locationManagement).values([
      {
        id: randomUUID(),
        userId: alice.id,
        locationId: cafe.id,
        approved: true,
      },
      {
        id: randomUUID(),
        userId: bob.id,
        locationId: restaurant.id,
        approved: true,
      },
      {
        id: randomUUID(),
        userId: charlie.id,
        locationId: coworking.id,
        approved: false,
      },
    ]);

    console.log('✅ Seeding completed successfully!');
    console.log(`   - ${users.length} users created`);
    console.log(`   - ${locations.length} locations created`);
    console.log(`   - ${reviews.length} reviews created`);
    console.log(`   - 6 review photos created`);
    console.log(`   - 11 review likes created`);
    console.log(`   - 6 comments created`);
    console.log(`   - 7 user follows created`);
    console.log(`   - 6 location follows created`);
    console.log(`   - 3 location management records created`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }

  process.exit(0);
}

main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});

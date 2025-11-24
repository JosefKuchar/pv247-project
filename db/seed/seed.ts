import 'dotenv/config';
import { reset, seed } from 'drizzle-seed';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../schema';

async function main() {
    console.log('Seeding database...');

    try {
        const db = drizzle(process.env.DATABASE_URL!);
        await reset(db, schema);
        await seed(db, schema, { seed: 1 });
        console.log('Seeding completed!');
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }

    process.exit(0);
}

main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});


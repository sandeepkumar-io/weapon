// Seed the air-to-air missile data into MongoDB (collection: airtoairmissiles).
// Run from the frontend folder:  node scripts/seed-missiles.mjs
import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load MONGODB_URI from frontend/.env.local (no extra deps).
const envPath = path.resolve(__dirname, '../.env.local');
try {
  for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) {
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      if (!process.env[m[1]]) process.env[m[1]] = v;
    }
  }
} catch {
  /* ignore */
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not found in environment or .env.local');
  process.exit(1);
}

const dataPath = path.resolve(__dirname, '../../air_to_air_missile_data.json');
const data = JSON.parse(readFileSync(dataPath, 'utf-8'));
console.log(`Loaded ${data.length} missile records.`);

const run = async () => {
  await mongoose.connect(uri);
  console.log('Connected to MongoDB.');

  // Insert via the native driver so every field (incl. the `id` slug) is stored
  // verbatim. A Mongoose schema would strip `id` (it reserves it for `_id`).
  const now = new Date();
  const docs = data.map((d) => ({ ...d, createdAt: now, updatedAt: now, __v: 0 }));

  const coll = mongoose.connection.db.collection('airtoairmissiles');
  await coll.drop().catch(() => console.log('(no existing collection to drop)'));

  const res = await coll.insertMany(docs);
  console.log(`Inserted ${res.insertedCount} records into "airtoairmissiles".`);

  const sample = await coll.findOne({ name: 'Astra IR' });
  console.log(`Sample id field: ${JSON.stringify(sample?.id)}`);
  console.log(`Collection now has ${await coll.countDocuments()} documents.`);

  await mongoose.disconnect();
  console.log('Done.');
};

run().catch((e) => {
  console.error('Seed failed:', e.message);
  process.exit(1);
});

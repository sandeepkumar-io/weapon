// Generic seeder: insert a JSON array into a MongoDB collection via the native
// driver (preserves every field, incl. the `id` slug that Mongoose would strip).
//
// Usage (run from the frontend folder):
//   node scripts/seed-json.mjs <jsonPath> <collectionName>
//   node scripts/seed-json.mjs src/script/bomber_data.json bombers
import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load MONGODB_URI from frontend/.env.local (no extra deps).
try {
  for (const line of readFileSync(path.resolve(__dirname, '../.env.local'), 'utf-8').split('\n')) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) {
      let v = m[2].trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
      if (!process.env[m[1]]) process.env[m[1]] = v;
    }
  }
} catch {
  /* ignore */
}

const [, , fileArg, collArg] = process.argv;
if (!fileArg || !collArg) {
  console.error('Usage: node scripts/seed-json.mjs <jsonPath> <collectionName>');
  process.exit(1);
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not found in environment or .env.local');
  process.exit(1);
}

const filePath = path.isAbsolute(fileArg) ? fileArg : path.resolve(process.cwd(), fileArg);
const data = JSON.parse(readFileSync(filePath, 'utf-8'));
console.log(`Loaded ${data.length} records from ${path.basename(filePath)}.`);

const run = async () => {
  await mongoose.connect(uri);
  console.log('Connected to MongoDB.');

  const now = new Date();
  const docs = data.map((d) => ({ ...d, createdAt: now, updatedAt: now, __v: 0 }));

  const coll = mongoose.connection.db.collection(collArg);
  await coll.drop().catch(() => console.log(`(no existing "${collArg}" collection to drop)`));

  const res = await coll.insertMany(docs);
  console.log(`Inserted ${res.insertedCount} records into "${collArg}".`);

  const sample = await coll.findOne({});
  console.log(`Sample id field: ${JSON.stringify(sample?.id)} | name: ${sample?.name}`);
  console.log(`Collection now has ${await coll.countDocuments()} documents.`);

  await mongoose.disconnect();
  console.log('Done.');
};

run().catch((e) => {
  console.error('Seed failed:', e.message);
  process.exit(1);
});

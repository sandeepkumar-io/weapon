// Script to update ALL weapon types images from Wikipedia

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://coolboy121001_db_user:6U5jTkPsqqQOX1yU@cluster0.7nlaysi.mongodb.net/?retryWrites=true&w=majority&authSource=admin';

// Collections to update
const COLLECTIONS = ['fighterjets', 'jetengines', 'rifles', 'sniperrifles', 'pistolbullets'];

async function updateImages() {
  try {
    console.log('🔗 Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected!\n');

    const db = mongoose.connection.db;
    let totalUpdated = 0;
    let totalFailed = 0;

    for (const collectionName of COLLECTIONS) {
      console.log(`\n📦 Processing collection: ${collectionName}`);
      const collection = db.collection(collectionName);

      const items = await collection.find({}).toArray();
      console.log(`   Found ${items.length} items\n`);

      let updated = 0;
      let failed = 0;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemName = item.name || item.id;
        console.log(`   [${i + 1}/${items.length}] 🔍 ${itemName}`);

        try {
          const res = await fetch(
            `http://localhost:3000/api/image-search?q=${encodeURIComponent(itemName)}`
          );

          if (!res.ok) {
            failed++;
            continue;
          }

          const data = await res.json();

          if (data.imageUrl) {
            await collection.updateOne(
              { _id: item._id },
              { $set: { imageUrl: data.imageUrl } }
            );
            updated++;
          } else {
            failed++;
          }
        } catch (err) {
          failed++;
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      console.log(`   ✅ ${collectionName}: ${updated} updated, ${failed} failed`);
      totalUpdated += updated;
      totalFailed += failed;
    }

    console.log(`\n✅ ALL COMPLETE!`);
    console.log(`   Total Updated: ${totalUpdated}`);
    console.log(`   Total Failed: ${totalFailed}`);

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateImages();

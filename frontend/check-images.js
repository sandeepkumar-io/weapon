/**
 * Script to check if images are saved in MongoDB
 * Usage: node check-images.js
 */

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://coolboy121001_db_user:6U5jTkPsqqQOX1yU@cluster0.7nlaysi.mongodb.net/?retryWrites=true&w=majority&authSource=admin';

async function checkImages() {
  try {
    console.log('🔗 Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected successfully!\n');

    const db = mongoose.connection.db;

    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log(`Found ${collections.length} collections\n`);

    // Check each collection for imageUrl field
    for (const collection of collections) {
      const name = collection.name;
      const coll = db.collection(name);

      // Count documents with imageUrl
      const withImage = await coll.countDocuments({ imageUrl: { $exists: true, $ne: null, $ne: '' } });
      const total = await coll.countDocuments({});

      if (total > 0) {
        console.log(`📦 Collection: ${name}`);
        console.log(`   Total items: ${total}`);
        console.log(`   With images: ${withImage} (${Math.round((withImage/total)*100)}%)`);

        // Show sample if images exist
        if (withImage > 0) {
          const sample = await coll.findOne({ imageUrl: { $exists: true, $ne: null } });
          if (sample) {
            console.log(`   Sample: ${sample.name || sample.id}`);
            console.log(`   Image URL: ${sample.imageUrl.substring(0, 80)}...`);
          }
        }
        console.log('');
      }
    }

    console.log('✅ Check complete!');
    await mongoose.connection.close();

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkImages();

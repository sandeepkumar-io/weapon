// Script to update weapon images from Wikipedia
// This is a compiled version of updateWeaponImages.ts

const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://coolboy121001_db_user:6U5jTkPsqqQOX1yU@cluster0.7nlaysi.mongodb.net/?retryWrites=true&w=majority&authSource=admin';

// Weapon model
const weaponSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
}, { strict: false });

const Weapon = mongoose.model('Weapon', weaponSchema);

async function updateImages() {
  try {
    console.log('🔗 Connecting to MongoDB...\n');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected!\n');

    console.log('📦 Fetching all weapons...');
    const weapons = await Weapon.find();
    console.log(`Found ${weapons.length} weapons\n`);

    let updated = 0;
    let failed = 0;

    for (let i = 0; i < weapons.length; i++) {
      const weapon = weapons[i];
      console.log(`[${i + 1}/${weapons.length}] 🔍 Searching image for: ${weapon.name}`);

      try {
        const res = await fetch(
          `http://localhost:3000/api/image-search?q=${encodeURIComponent(weapon.name)}`
        );

        if (!res.ok) {
          console.log(`   ⚠️  API error: ${res.status}`);
          failed++;
          continue;
        }

        const data = await res.json();

        if (data.imageUrl) {
          weapon.imageUrl = data.imageUrl;
          await weapon.save();
          console.log(`   ✅ Updated: ${data.imageUrl.substring(0, 60)}...`);
          updated++;
        } else {
          console.log(`   ⚠️  No image found on Wikipedia`);
          failed++;
        }
      } catch (err) {
        console.log(`   ❌ Error: ${err.message}`);
        failed++;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`\n✅ Complete!`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Failed: ${failed}`);

    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateImages();

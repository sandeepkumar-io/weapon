import { connectDB } from "@/lib/mongodb";
import { Weapon } from "@/models/Weapon";

async function updateImages() {
  await connectDB();

  const weapons = await Weapon.find();

  for (const weapon of weapons) {
    console.log(`Searching image for ${weapon.name}`);

    const res = await fetch(
      `http://localhost:3000/api/image-search?q=${encodeURIComponent(
        weapon.name
      )}`
    );

    const data = await res.json();

    if (data.imageUrl) {
      weapon.imageUrl = data.imageUrl;
      await weapon.save();

      console.log(`Updated ${weapon.name}`);
    }
  }

  process.exit(0);
}

updateImages();
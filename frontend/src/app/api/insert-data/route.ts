import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Weapon } from '@/models/Weapon';
import { Category } from '@/models/Category';
import { FighterJet } from '@/models/FighterJet';
import { JetEngine } from '@/models/JetEngine';
import { PistolBullet } from '@/models/PistolBullet';
import { Rifle } from '@/models/Rifle';
import { SniperRifle } from '@/models/SniperRifle';
import fs from 'fs';
import path from 'path';

export async function POST() {
  try {
    await connectDB();

    // Clear all old data
    await Weapon.deleteMany({});
    await Category.deleteMany({});

    // Drop old collections to clear any old data
    try {
      await FighterJet.collection.drop();
      console.log('FighterJet collection dropped');
    } catch (error) {
      console.log('FighterJet collection does not exist yet');
    }

    try {
      await JetEngine.collection.drop();
      console.log('JetEngine collection dropped');
    } catch (error) {
      console.log('JetEngine collection does not exist yet');
    }

    try {
      await PistolBullet.collection.drop();
      console.log('PistolBullet collection dropped');
    } catch (error) {
      console.log('PistolBullet collection does not exist yet');
    }

    try {
      await Rifle.collection.drop();
      console.log('Rifle collection dropped');
    } catch (error) {
      console.log('Rifle collection does not exist yet');
    }

    try {
      await SniperRifle.collection.drop();
      console.log('SniperRifle collection dropped');
    } catch (error) {
      console.log('SniperRifle collection does not exist yet');
    }

    console.log('Old data cleared');

    // Helper function to clean data
    const cleanData = (data: any[]) => {
      return data.map((item: any) => {
        const cleaned: any = {};
        for (const [key, value] of Object.entries(item)) {
          cleaned[key] = value === '' ? null : value;
        }
        return cleaned;
      });
    };

    // Read fighter jet data from JSON file
    const fighterJetPath = 'C:\\sandeep\\llm-data-generator\\data\\fighter_jet_data.json';
    const fighterJetData = fs.readFileSync(fighterJetPath, 'utf-8');
    let fighterJets = JSON.parse(fighterJetData);
    fighterJets = cleanData(fighterJets);

    // Read jet engine data from JSON file
    const jetEnginePath = 'C:\\sandeep\\llm-data-generator\\data\\jet_engine_data.json';
    const jetEngineData = fs.readFileSync(jetEnginePath, 'utf-8');
    let jetEngines = JSON.parse(jetEngineData);
    jetEngines = cleanData(jetEngines);

    // Read pistol bullet data from JSON file
    const pistolBulletPath = 'C:\\sandeep\\llm-data-generator\\data\\pistol_bullet_data.json';
    const pistolBulletData = fs.readFileSync(pistolBulletPath, 'utf-8');
    let pistolBullets = JSON.parse(pistolBulletData);
    pistolBullets = cleanData(pistolBullets);

    // Read rifle data from JSON file
    const riflePath = 'C:\\sandeep\\llm-data-generator\\data\\rifle_data.json';
    const rifleData = fs.readFileSync(riflePath, 'utf-8');
    let rifles = JSON.parse(rifleData);
    rifles = cleanData(rifles);

    // Read sniper rifle data from JSON file
    const sniperRiflePath = 'C:\\sandeep\\llm-data-generator\\data\\sniper_rifle_data.json';
    const sniperRifleData = fs.readFileSync(sniperRiflePath, 'utf-8');
    let sniperRifles = JSON.parse(sniperRifleData);
    sniperRifles = cleanData(sniperRifles);

    // Insert fighter jets
    const insertedFighterJets = await FighterJet.insertMany(fighterJets);
    console.log(`Inserted ${insertedFighterJets.length} fighter jets`);

    // Insert jet engines
    const insertedJetEngines = await JetEngine.insertMany(jetEngines);
    console.log(`Inserted ${insertedJetEngines.length} jet engines`);

    // Insert pistol bullets
    const insertedPistolBullets = await PistolBullet.insertMany(pistolBullets);
    console.log(`Inserted ${insertedPistolBullets.length} pistol bullets`);

    // Insert rifles
    const insertedRifles = await Rifle.insertMany(rifles);
    console.log(`Inserted ${insertedRifles.length} rifles`);

    // Insert sniper rifles
    const insertedSniperRifles = await SniperRifle.insertMany(sniperRifles);
    console.log(`Inserted ${insertedSniperRifles.length} sniper rifles`);

    return NextResponse.json(
      {
        success: true,
        message: 'Data inserted successfully',
        fighterJets: insertedFighterJets.length,
        jetEngines: insertedJetEngines.length,
        pistolBullets: insertedPistolBullets.length,
        rifles: insertedRifles.length,
        sniperRifles: insertedSniperRifles.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error inserting data:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const fighterJetsCount = await FighterJet.countDocuments();
    const jetEnginesCount = await JetEngine.countDocuments();
    const pistolBulletsCount = await PistolBullet.countDocuments();
    const riflesCount = await Rifle.countDocuments();
    const sniperRiflesCount = await SniperRifle.countDocuments();

    return NextResponse.json(
      {
        success: true,
        fighterJets: fighterJetsCount,
        jetEngines: jetEnginesCount,
        pistolBullets: pistolBulletsCount,
        rifles: riflesCount,
        sniperRifles: sniperRiflesCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

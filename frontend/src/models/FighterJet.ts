import mongoose, { Schema, Document } from 'mongoose';

/**
 * Mirrors the structure of the datasets in `public/aircraft_data`, plus the
 * fields `loadAircraftDocuments()` derives (`id`, `datasetCountries`,
 * `generationTier`, `statusGroup`, `generatedImages`).
 */
export interface IFighterJet extends Document {
  id: string;
  slug: string;
  name: string;
  description: string;
  manufacturer: string;
  designer: string;
  originCountry: string;
  datasetCountries: string[];
  aircraftType: string;
  roles: string[];
  generation: string;
  generationTier: string;
  status: string;
  statusGroup: string;
  firstFlightDate: string;
  introducedYear: number;
  crew: number;
  dimensions: { lengthM?: number; wingspanM?: number; heightM?: number };
  weights: { emptyWeightKg?: number; maximumTakeoffWeightKg?: number; maximumPayloadKg?: number };
  performance: {
    maximumSpeedKmh?: number;
    maximumSpeedMach?: number;
    combatRadiusKm?: number;
    ferryRangeKm?: number;
    serviceCeilingM?: number;
    rateOfClimbMPerSecond?: number;
  };
  engine: {
    name?: string;
    manufacturer?: string;
    type?: string;
    count?: number;
    dryThrustKNEach?: number;
    afterburningThrustKNEach?: number;
  };
  radar: { name?: string; manufacturer?: string; type?: string; rangeKm?: number };
  electronicWarfare: {
    systems: string[];
    radarWarningReceiver?: string;
    missileApproachWarningSystem?: string;
    countermeasures: string[];
  };
  armament: {
    internalGun?: { name?: string; caliberMm?: number };
    hardpoints?: number;
    maximumExternalStoresKg?: number;
    airToAirMissiles: string[];
    airToGroundMissiles: string[];
    antiShipMissiles: string[];
    guidedBombs: string[];
    unguidedBombs: string[];
    rockets: string[];
    otherWeapons: string[];
  };
  avionics: {
    flightControlSystem?: string;
    navigationSystems: string[];
    communicationSystems: string[];
    helmetMountedDisplay?: string;
    infraredSearchAndTrack?: string;
  };
  stealth: {
    stealthCapability?: boolean;
    radarCrossSectionSqM?: number;
    internalWeaponsBay?: boolean;
  };
  operational: {
    operators: string[];
    numberBuilt?: number;
    unitCostUsd?: number;
    productionStartYear?: number;
    productionEndYear?: number;
  };
  media: {
    imageUrls: string[];
    videoUrl?: string;
    componentImages: Record<string, Record<string, string>>;
  };
  generatedImages: string[];
  variants: string[];
  sources: string[];
  lastVerifiedAt: string;
  scrapingStatus: string;
}

/** Sub-documents are `_id: false` — they are plain value objects, not entities. */
const sub = { _id: false } as const;

const fighterJetSchema = new Schema<IFighterJet>(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    description: { type: String, default: '' },
    manufacturer: { type: String, default: '' },
    designer: { type: String, default: '' },
    originCountry: { type: String, default: '', index: true },
    datasetCountries: { type: [String], default: [], index: true },
    aircraftType: { type: String, default: '' },
    roles: { type: [String], default: [] },
    generation: { type: String, default: '' },
    generationTier: { type: String, default: 'Unclassified', index: true },
    status: { type: String, default: '' },
    statusGroup: { type: String, default: 'In service', index: true },
    firstFlightDate: { type: String, default: '' },
    introducedYear: { type: Number, default: null },
    crew: { type: Number, default: null },

    dimensions: new Schema(
      {
        lengthM: Number,
        wingspanM: Number,
        heightM: Number,
      },
      sub,
    ),

    weights: new Schema(
      {
        emptyWeightKg: Number,
        maximumTakeoffWeightKg: Number,
        maximumPayloadKg: Number,
      },
      sub,
    ),

    performance: new Schema(
      {
        maximumSpeedKmh: Number,
        maximumSpeedMach: Number,
        combatRadiusKm: Number,
        ferryRangeKm: Number,
        serviceCeilingM: Number,
        rateOfClimbMPerSecond: Number,
      },
      sub,
    ),

    engine: new Schema(
      {
        name: String,
        manufacturer: String,
        type: String,
        count: Number,
        dryThrustKNEach: Number,
        afterburningThrustKNEach: Number,
      },
      sub,
    ),

    radar: new Schema(
      {
        name: String,
        manufacturer: String,
        type: String,
        rangeKm: Number,
      },
      sub,
    ),

    electronicWarfare: new Schema(
      {
        systems: { type: [String], default: [] },
        radarWarningReceiver: String,
        missileApproachWarningSystem: String,
        countermeasures: { type: [String], default: [] },
      },
      sub,
    ),

    armament: new Schema(
      {
        internalGun: new Schema({ name: String, caliberMm: Number }, sub),
        hardpoints: Number,
        maximumExternalStoresKg: Number,
        airToAirMissiles: { type: [String], default: [] },
        airToGroundMissiles: { type: [String], default: [] },
        antiShipMissiles: { type: [String], default: [] },
        guidedBombs: { type: [String], default: [] },
        unguidedBombs: { type: [String], default: [] },
        rockets: { type: [String], default: [] },
        otherWeapons: { type: [String], default: [] },
      },
      sub,
    ),

    avionics: new Schema(
      {
        flightControlSystem: String,
        navigationSystems: { type: [String], default: [] },
        communicationSystems: { type: [String], default: [] },
        helmetMountedDisplay: String,
        infraredSearchAndTrack: String,
      },
      sub,
    ),

    stealth: new Schema(
      {
        stealthCapability: { type: Boolean, default: false },
        radarCrossSectionSqM: Number,
        internalWeaponsBay: { type: Boolean, default: false },
      },
      sub,
    ),

    operational: new Schema(
      {
        operators: { type: [String], default: [] },
        numberBuilt: Number,
        unitCostUsd: Number,
        productionStartYear: Number,
        productionEndYear: Number,
      },
      sub,
    ),

    media: new Schema(
      {
        imageUrls: { type: [String], default: [] },
        videoUrl: String,
        // Category -> component name -> image url. Keys are free-form component
        // names, so this stays a loose Map rather than a fixed shape.
        componentImages: { type: Schema.Types.Mixed, default: {} },
      },
      sub,
    ),

    generatedImages: { type: [String], default: [] },
    variants: { type: [String], default: [] },
    sources: { type: [String], default: [] },
    lastVerifiedAt: { type: String, default: '' },
    scrapingStatus: { type: String, default: '' },
  },
  { timestamps: true, strict: false },
);

// Delete cached model to ensure schema updates are applied
if (mongoose.models.FighterJet) {
  delete mongoose.models.FighterJet;
}

export const FighterJet = mongoose.model<IFighterJet>('FighterJet', fighterJetSchema);

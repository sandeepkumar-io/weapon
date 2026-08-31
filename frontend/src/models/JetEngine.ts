import mongoose, { Schema, Document } from 'mongoose';

/**
 * Mirrors the structure of the datasets in `public/engine_data`, plus the
 * fields `loadEngineDocuments()` derives (`id`, `datasetCountries`,
 * `generationTier`, `statusGroup`, `engineTypeGroup`, `generatedImages`).
 */
export interface IJetEngine extends Document {
  id: string;
  slug: string;
  name: string;
  description: string;
  manufacturer: string;
  designer: string;
  originCountry: string;
  datasetCountries: string[];
  engineType: string;
  engineTypeGroup: string;
  generation: string;
  generationTier: string;
  status: string;
  statusGroup: string;
  firstRunYear: number;
  introducedYear: number;
  applications: string[];
  alsoKnownAs: string[];
  programName: string;
  dimensions: { lengthM?: number; diameterM?: number; dryWeightKg?: number };
  thrust: {
    dryThrustKN?: number;
    afterburningThrustKN?: number;
    thrustToWeightRatio?: number;
    specificFuelConsumptionDryKgPerKNPerHour?: number;
    specificFuelConsumptionAfterburningKgPerKNPerHour?: number;
  };
  performance: {
    bypassRatio?: number;
    overallPressureRatio?: number;
    airMassFlowKgPerSecond?: number;
    maximumRpm?: number;
    supercruiseCapable?: boolean;
  };
  compressor: {
    type?: string;
    fanStages?: number;
    lowPressureStages?: number;
    highPressureStages?: number;
    bladeMaterial?: string;
    fanDiameterM?: number;
    fanBladeType?: string;
    fanBladeMaterial?: string;
    fanPressureRatio?: number;
  };
  combustor: { type?: string; fuelInjectionType?: string; linerMaterial?: string };
  turbine: {
    highPressureStages?: number;
    lowPressureStages?: number;
    inletTemperatureK?: number;
    bladeMaterial?: string;
    bladeCoolingType?: string;
  };
  afterburner: {
    type?: string;
    flameHolderType?: string;
    linerMaterial?: string;
    maximumTemperatureK?: number;
    screechSuppression?: string;
  };
  nozzle: {
    type?: string;
    thrustVectoring?: boolean;
    vectoringAxes?: string;
    maximumDeflectionDegrees?: number;
  };
  controlSystem: { type?: string; manufacturer?: string; fadecGeneration?: string };
  maintenance: {
    timeBetweenOverhaulHours?: number;
    hotSectionInspectionHours?: number;
    serviceLifeHours?: number;
    meanTimeBetweenFailuresHours?: number;
  };
  operational: {
    operators: string[];
    numberBuilt?: number;
    unitCostUsd?: number;
    productionStartYear?: number;
    productionEndYear?: number;
  };
  parts: {
    moduleCount?: number;
    majorModules: string[];
    gearboxType?: string;
    startingSystem?: string;
    fuelSystem?: string;
    lubricationSystem?: string;
    ignitionSystem?: string;
    bearingCount?: number;
  };
  materials: {
    fanBladeMaterial?: string;
    compressorCaseMaterial?: string;
    turbineDiscMaterial?: string;
    thermalBarrierCoating?: string;
    compositeComponents: string[];
    singleCrystalBlades?: boolean;
    additiveManufacturedParts: string[];
  };
  technology: {
    keyTechnologies: string[];
    coolingTechnology?: string;
    healthMonitoringSystem?: string;
    adaptiveCycle?: boolean;
    stealthFeatures?: string;
    noiseReduction?: string;
  };
  development: {
    history?: string;
    developmentStartYear?: number;
    developmentCostUsd?: number;
    certificationYear?: number;
    predecessorEngine?: string;
    successorEngine?: string;
    developmentPartners: string[];
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

const jetEngineSchema = new Schema<IJetEngine>(
  {
    id: { type: String, required: true, unique: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    description: { type: String, default: '' },
    manufacturer: { type: String, default: '', index: true },
    designer: { type: String, default: '' },
    originCountry: { type: String, default: '', index: true },
    datasetCountries: { type: [String], default: [], index: true },
    engineType: { type: String, default: '' },
    engineTypeGroup: { type: String, default: 'Other', index: true },
    generation: { type: String, default: '' },
    generationTier: { type: String, default: 'Unclassified', index: true },
    status: { type: String, default: '' },
    statusGroup: { type: String, default: 'In service', index: true },
    firstRunYear: { type: Number, default: null },
    introducedYear: { type: Number, default: null },
    applications: { type: [String], default: [] },
    alsoKnownAs: { type: [String], default: [] },
    programName: { type: String, default: '' },

    dimensions: new Schema(
      {
        lengthM: Number,
        diameterM: Number,
        dryWeightKg: Number,
      },
      sub,
    ),

    thrust: new Schema(
      {
        dryThrustKN: Number,
        afterburningThrustKN: Number,
        thrustToWeightRatio: Number,
        specificFuelConsumptionDryKgPerKNPerHour: Number,
        specificFuelConsumptionAfterburningKgPerKNPerHour: Number,
      },
      sub,
    ),

    performance: new Schema(
      {
        bypassRatio: Number,
        overallPressureRatio: Number,
        airMassFlowKgPerSecond: Number,
        maximumRpm: Number,
        supercruiseCapable: { type: Boolean, default: false },
      },
      sub,
    ),

    compressor: new Schema(
      {
        type: String,
        fanStages: Number,
        lowPressureStages: Number,
        highPressureStages: Number,
        bladeMaterial: String,
        fanDiameterM: Number,
        fanBladeType: String,
        fanBladeMaterial: String,
        fanPressureRatio: Number,
      },
      sub,
    ),

    combustor: new Schema(
      {
        type: String,
        fuelInjectionType: String,
        linerMaterial: String,
      },
      sub,
    ),

    turbine: new Schema(
      {
        highPressureStages: Number,
        lowPressureStages: Number,
        inletTemperatureK: Number,
        bladeMaterial: String,
        bladeCoolingType: String,
      },
      sub,
    ),

    afterburner: new Schema(
      {
        type: String,
        flameHolderType: String,
        linerMaterial: String,
        maximumTemperatureK: Number,
        screechSuppression: String,
      },
      sub,
    ),

    nozzle: new Schema(
      {
        type: String,
        thrustVectoring: { type: Boolean, default: false },
        vectoringAxes: String,
        maximumDeflectionDegrees: Number,
      },
      sub,
    ),

    controlSystem: new Schema(
      {
        type: String,
        manufacturer: String,
        fadecGeneration: String,
      },
      sub,
    ),

    maintenance: new Schema(
      {
        timeBetweenOverhaulHours: Number,
        hotSectionInspectionHours: Number,
        serviceLifeHours: Number,
        meanTimeBetweenFailuresHours: Number,
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

    parts: new Schema(
      {
        moduleCount: Number,
        majorModules: { type: [String], default: [] },
        gearboxType: String,
        startingSystem: String,
        fuelSystem: String,
        lubricationSystem: String,
        ignitionSystem: String,
        bearingCount: Number,
      },
      sub,
    ),

    materials: new Schema(
      {
        fanBladeMaterial: String,
        compressorCaseMaterial: String,
        turbineDiscMaterial: String,
        thermalBarrierCoating: String,
        compositeComponents: { type: [String], default: [] },
        singleCrystalBlades: { type: Boolean, default: false },
        additiveManufacturedParts: { type: [String], default: [] },
      },
      sub,
    ),

    technology: new Schema(
      {
        keyTechnologies: { type: [String], default: [] },
        coolingTechnology: String,
        healthMonitoringSystem: String,
        adaptiveCycle: { type: Boolean, default: false },
        stealthFeatures: String,
        noiseReduction: String,
      },
      sub,
    ),

    development: new Schema(
      {
        history: String,
        developmentStartYear: Number,
        developmentCostUsd: Number,
        certificationYear: Number,
        predecessorEngine: String,
        successorEngine: String,
        developmentPartners: { type: [String], default: [] },
      },
      sub,
    ),

    media: new Schema(
      {
        imageUrls: { type: [String], default: [] },
        videoUrl: String,
        // Category -> component name -> image url. Keys are free-form component
        // names, so this stays a loose Mixed rather than a fixed shape.
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
if (mongoose.models.JetEngine) {
  delete mongoose.models.JetEngine;
}

export const JetEngine = mongoose.model<IJetEngine>('JetEngine', jetEngineSchema);

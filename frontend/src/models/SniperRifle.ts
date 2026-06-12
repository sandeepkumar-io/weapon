import mongoose, { Schema, Document } from 'mongoose';

export interface ISniperRifle extends Document {
  id: string;
  name: string;
  category: string;
  status?: string;
  origin: string;
  manufacturer?: string;
  caliber?: string;
  action?: string;
  generation?: string;
  first_produced?: string;
  introduced?: string;
  retired?: string;
  effective_range?: string;
  maximum_range?: string;
  muzzle_velocity?: string;
  barrel_length?: string;
  overall_length?: string;
  weight?: string;
  magazine_capacity?: string;
  feed_system?: string;
  used_by?: string;
  description: string;
  images?: string;
  generatedImages?: string[];
  specs: { label: string; value: string }[];
}

const sniperRifleSchema = new Schema<ISniperRifle>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: String, required: false },
    origin: { type: String, required: true },
    manufacturer: { type: String, required: false },
    caliber: { type: String, required: false },
    action: { type: String, required: false },
    generation: { type: String, required: false },
    first_produced: { type: String, required: false },
    introduced: { type: String, required: false },
    retired: { type: String, required: false },
    effective_range: { type: String, required: false },
    maximum_range: { type: String, required: false },
    muzzle_velocity: { type: String, required: false },
    barrel_length: { type: String, required: false },
    overall_length: { type: String, required: false },
    weight: { type: String, required: false },
    magazine_capacity: { type: String, required: false },
    feed_system: { type: String, required: false },
    used_by: { type: String, required: false },
    description: { type: String, required: true },
    images: { type: String, required: false },
    generatedImages: [{ type: String }],
    specs: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

// Delete cached model to ensure schema updates are applied
if (mongoose.models.SniperRifle) {
  delete mongoose.models.SniperRifle;
}

export const SniperRifle = mongoose.model<ISniperRifle>('SniperRifle', sniperRifleSchema);

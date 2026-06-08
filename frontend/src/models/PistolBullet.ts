import mongoose, { Schema, Document } from 'mongoose';

export interface IPistolBullet extends Document {
  id: string;
  name: string;
  caliber: string;
  category: string;
  status: string;
  origin: string;
  manufacturer: string;
  introduced?: string;
  retired?: string;
  bullet_weight?: string;
  muzzle_velocity?: string;
  muzzle_energy?: string;
  bullet_diameter?: string;
  case_length?: string;
  overall_length?: string;
  used_in?: string;
  description: string;
  images?: string;
  specs: { label: string; value: string }[];
}

const pistolBulletSchema = new Schema<IPistolBullet>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    caliber: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: String, required: true },
    origin: { type: String, required: true },
    manufacturer: { type: String, required: true },
    introduced: { type: String, required: false },
    retired: { type: String, required: false },
    bullet_weight: { type: String, required: false },
    muzzle_velocity: { type: String, required: false },
    muzzle_energy: { type: String, required: false },
    bullet_diameter: { type: String, required: false },
    case_length: { type: String, required: false },
    overall_length: { type: String, required: false },
    used_in: { type: String, required: false },
    description: { type: String, required: true },
    images: { type: String, required: false },
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
if (mongoose.models.PistolBullet) {
  delete mongoose.models.PistolBullet;
}

export const PistolBullet = mongoose.model<IPistolBullet>('PistolBullet', pistolBulletSchema);

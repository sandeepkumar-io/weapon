import mongoose, { Schema, Document } from 'mongoose';

export interface IWeapon extends Document {
  id: string;
  name: string;
  category: string;
  origin: string;
  caliber?: string;
  range?: string;
  weight: string;
  speed?: string;
  description: string;
  specs: { label: string; value: string }[];
}

const weaponSchema = new Schema<IWeapon>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    origin: { type: String, required: true },
    caliber: String,
    range: String,
    weight: { type: String, required: true },
    speed: String,
    description: { type: String, required: true },
    specs: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const Weapon = mongoose.models.Weapon || mongoose.model<IWeapon>('Weapon', weaponSchema);

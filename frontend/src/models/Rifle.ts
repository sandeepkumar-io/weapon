import mongoose, { Schema, Document } from 'mongoose';

export interface IRifle extends Document {
  id: string;
  name: string;
  category: string;
  origin: string;
  caliber?: string;
  range?: string;
  weight?: string;
  description: string;
  images?: string;
  generatedImages?: string[];
  specs: { label: string; value: string }[];
}

const rifleSchema = new Schema<IRifle>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    origin: { type: String, required: true },
    caliber: { type: String, required: false },
    range: { type: String, required: false },
    weight: { type: String, required: false },
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
if (mongoose.models.Rifle) {
  delete mongoose.models.Rifle;
}

export const Rifle = mongoose.model<IRifle>('Rifle', rifleSchema);

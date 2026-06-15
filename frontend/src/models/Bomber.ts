import mongoose, { Schema, Document } from 'mongoose';

export interface IBomber extends Document {
  id: string;
  name: string;
  category: string;
  status: string;
  origin: string;
  manufacturer: string;
  role: string;
  max_speed: string;
  range?: string;
  payload?: string;
  service_ceiling?: string;
  description: string;
  generatedImages?: string[];
  specs: { label: string; value: string }[];
}

const bomberSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: String },
    origin: { type: String, required: true },
    manufacturer: { type: String },
    generation: { type: String },
    role: { type: String },
    first_flight: { type: String },
    introduced: { type: String },
    retired: { type: String },
    max_speed: { type: String },
    range: { type: String },
    combat_radius: { type: String },
    service_ceiling: { type: String },
    payload: { type: String },
    weight: { type: String },
    engines: { type: String },
    crew: { type: String },
    description: { type: String, required: true },
    images: { type: String },
    imageUrl: { type: String },
    generatedImages: [{ type: String }],
    specs: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
  },
  { timestamps: true, strict: false },
);

// Refresh cached model so schema updates always apply.
if (mongoose.models.Bomber) {
  delete mongoose.models.Bomber;
}

export const Bomber = mongoose.model('Bomber', bomberSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IAirplane extends Document {
  id: string;
  name: string;
  category?: string;
  status?: string;
  origin?: string;
  manufacturer?: string;
  generation?: string;
  first_flight?: string;
  introduced?: string;
  retired?: string;
  max_speed?: string;
  cruise_speed?: string;
  range?: string;
  service_ceiling?: string;
  capacity?: string;
  crew?: string;
  engine?: string;
  mtow?: string;
  length?: string;
  description?: string;
  images?: string;
  imageUrl?: string;
  generatedImages?: string[];
  specs?: { label: string; value: string }[];
}

const airplaneSchema = new Schema<IAirplane>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: false },
    status: { type: String, required: false },
    origin: { type: String, required: false },
    manufacturer: { type: String, required: false },
    generation: { type: String, required: false },
    first_flight: { type: String, required: false },
    introduced: { type: String, required: false },
    retired: { type: String, required: false },
    max_speed: { type: String, required: false },
    cruise_speed: { type: String, required: false },
    range: { type: String, required: false },
    service_ceiling: { type: String, required: false },
    capacity: { type: String, required: false },
    crew: { type: String, required: false },
    engine: { type: String, required: false },
    mtow: { type: String, required: false },
    length: { type: String, required: false },
    description: { type: String, required: false },
    images: { type: String, required: false },
    imageUrl: { type: String, required: false },
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

if (mongoose.models.Airplane) {
  delete mongoose.models.Airplane;
}

export const Airplane = mongoose.model<IAirplane>('Airplane', airplaneSchema);

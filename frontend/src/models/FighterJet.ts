import mongoose, { Schema, Document } from 'mongoose';

export interface IFighterJet extends Document {
  id: string;
  name: string;
  category: string;
  status: string;
  origin: string;
  manufacturer: string;
  generation: string;
  role: string;
  first_flight: string;
  introduced: string;
  retired: string;
  max_speed: string;
  range: string;
  service_ceiling: string;
  weight: string;
  engines: string;
  crew: string;
  description: string;
  images: string;
  specs: { label: string; value: string }[];
}

const fighterJetSchema = new Schema<IFighterJet>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: String, required: true },
    origin: { type: String, required: true },
    manufacturer: { type: String, required: true },
    generation: { type: String, required: false },
    role: { type: String, required: true },
    first_flight: { type: String, required: false },
    introduced: { type: String, required: false },
    retired: { type: String, required: false },
    max_speed: { type: String, required: true },
    range: { type: String, required: false },
    service_ceiling: { type: String, required: false },
    weight: { type: String, required: true },
    engines: { type: String, required: false },
    crew: { type: String, required: false },
    description: { type: String, required: true },
    images: String,
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
if (mongoose.models.FighterJet) {
  delete mongoose.models.FighterJet;
}

export const FighterJet = mongoose.model<IFighterJet>('FighterJet', fighterJetSchema);

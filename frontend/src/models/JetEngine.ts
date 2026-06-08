import mongoose, { Schema, Document } from 'mongoose';

export interface IJetEngine extends Document {
  id: string;
  name: string;
  manufacturer: string;
  origin: string;
  type: string;
  status: string;
  first_run?: string;
  introduced?: string;
  retired?: string;
  thrust: string;
  thrust_with_afterburner?: string;
  bypass_ratio?: string;
  pressure_ratio?: string;
  mass_flow?: string;
  dry_weight?: string;
  length?: string;
  diameter?: string;
  used_in?: string;
  description: string;
  images?: string;
  specs: { label: string; value: string }[];
}

const jetEngineSchema = new Schema<IJetEngine>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    origin: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    first_run: { type: String, required: false },
    introduced: { type: String, required: false },
    retired: { type: String, required: false },
    thrust: { type: String, required: true },
    thrust_with_afterburner: { type: String, required: false },
    bypass_ratio: { type: String, required: false },
    pressure_ratio: { type: String, required: false },
    mass_flow: { type: String, required: false },
    dry_weight: { type: String, required: false },
    length: { type: String, required: false },
    diameter: { type: String, required: false },
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
if (mongoose.models.JetEngine) {
  delete mongoose.models.JetEngine;
}

export const JetEngine = mongoose.model<IJetEngine>('JetEngine', jetEngineSchema);

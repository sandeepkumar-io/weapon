import mongoose, { Schema, Document } from 'mongoose';

export interface IAirToAirMissile extends Document {
  id: string;
  name: string;
  category: string;
  status: string;
  origin: string;
  manufacturer: string;
  role: string;
  guidance?: string;
  warhead?: string;
  max_speed: string;
  range?: string;
  weight?: string;
  description: string;
  generatedImages?: string[];
  specs: { label: string; value: string }[];
}

const airToAirMissileSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: String },
    origin: { type: String, required: true },
    manufacturer: { type: String },
    role: { type: String },
    guidance: { type: String },
    seeker: { type: String },
    propulsion: { type: String },
    warhead: { type: String },
    first_flight: { type: String },
    introduced: { type: String },
    retired: { type: String },
    max_speed: { type: String },
    range: { type: String },
    min_range: { type: String },
    engagement_altitude: { type: String },
    weight: { type: String },
    length: { type: String },
    diameter: { type: String },
    launch_platforms: { type: String },
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
if (mongoose.models.AirToAirMissile) {
  delete mongoose.models.AirToAirMissile;
}

export const AirToAirMissile = mongoose.model('AirToAirMissile', airToAirMissileSchema);

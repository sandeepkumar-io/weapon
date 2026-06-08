import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  count: number;
  description: string;
}

const categorySchema = new Schema<ICategory>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    subtitle: { type: String, required: true },
    icon: { type: String, required: true },
    count: { type: Number, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', categorySchema);

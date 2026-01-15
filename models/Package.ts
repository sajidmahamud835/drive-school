import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPackage extends Document {
  id: string;
  name: string;
  duration: string;
  price: number;
  description: string;
  features: string[];
  isActive: boolean;
  note?: string;
}

const PackageSchema = new Schema<IPackage>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      enum: ['15-days', '1-month', 'pay-as-you-go'],
    },
    name: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      required: true,
      default: [],
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    note: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Package: Model<IPackage> = mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema);

export default Package;

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBooking extends Document {
  userFirebaseUid: string;
  packageId: string;
  selectedDate: Date;
  selectedTime: string;
  status: 'pending' | 'confirmed' | 'rejected';
  phone: string;
  email?: string;
  name: string;
  age: number;
  whyLearning: 'going-abroad' | 'interest-hobby' | 'work-career' | 'others';
  address: string;
  previousTraining: boolean;
  // Admin fields
  assignedPackage?: '15-days' | '1-month' | 'old-student'; // Package assigned by admin during approval
  fee?: number; // Total fee
  totalPaid?: number; // Total amount paid (can be multiple partial payments)
  due?: number; // Remaining due amount
  payments?: Array<{
    amount: number;
    date: Date;
    method: string; // 'cash' | 'bank' | 'other'
    notes?: string;
  }>;
  invoiceNumber?: string; // Unique invoice number
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    userFirebaseUid: {
      type: String,
      required: true,
      index: true,
    },
    packageId: {
      type: String,
      required: true,
      enum: ['15-days', '1-month', 'pay-as-you-go'],
    },
    selectedDate: {
      type: Date,
      required: true,
      index: true,
    },
    selectedTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected'],
      default: 'pending',
      index: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
      min: 16,
      max: 100,
    },
    whyLearning: {
      type: String,
      required: true,
      enum: ['going-abroad', 'interest-hobby', 'work-career', 'others'],
    },
    address: {
      type: String,
      required: true,
    },
    previousTraining: {
      type: Boolean,
      required: true,
      default: false,
    },
    // Admin fields
    assignedPackage: {
      type: String,
      enum: ['15-days', '1-month', 'old-student'],
    },
    fee: {
      type: Number,
      min: 0,
    },
    totalPaid: {
      type: Number,
      min: 0,
      default: 0,
    },
    due: {
      type: Number,
      min: 0,
      default: 0,
    },
    payments: [{
      amount: { type: Number, required: true },
      date: { type: Date, required: true, default: Date.now },
      method: { type: String, enum: ['cash', 'bank', 'other'], required: true },
      notes: { type: String },
    }],
    invoiceNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
BookingSchema.index({ selectedDate: 1, selectedTime: 1, status: 1 });
BookingSchema.index({ userFirebaseUid: 1, status: 1 });

const Booking: Model<IBooking> = mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;

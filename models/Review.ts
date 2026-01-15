import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  userFirebaseUid: string;
  studentId: string;
  studentName: string;
  rating: number; // 1-5
  text: string;
  status: 'pending' | 'approved' | 'rejected'; // Admin can moderate reviews
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    userFirebaseUid: {
      type: String,
      required: true,
      index: true,
    },
    studentId: {
      type: String,
      required: true,
      index: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
ReviewSchema.index({ status: 1, createdAt: -1 });
ReviewSchema.index({ studentId: 1 });

// Prevent re-compilation during development
const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;

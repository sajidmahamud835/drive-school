import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  firebaseUid: string;
  studentId: string; // Unique student ID
  email: string;
  phone: string;
  name: string;
  age?: number;
  gender: 'male' | 'female' | 'other';
  address?: string;
  status: 'pending' | 'approved' | 'completed'; // Student status
  // Additional profile fields
  dateOfBirth?: Date;
  nid?: string; // National ID
  emergencyContact?: string;
  emergencyPhone?: string;
  bloodGroup?: string;
  occupation?: string;
  education?: string;
  // Social media profiles
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  // Certificate fields
  certificateId?: string; // Unique certificate ID
  certificateLink?: string; // Publicly shareable link
  completionDate?: Date; // When course was completed
  createdAt: Date;
  updatedAt: Date;
}

// Generate unique student ID - exported for use in API routes
export async function generateStudentId(UserModel?: Model<IUser>): Promise<string> {
  const year = new Date().getFullYear().toString().slice(-2);
  const prefix = `TS${year}`;
  
  try {
    // Get the User model - try parameter first, then mongoose.models, then mongoose.model
    let model = UserModel;
    if (!model) {
      model = mongoose.models.User as Model<IUser> | undefined;
    }
    if (!model) {
      // Try to get it from mongoose.model (will return existing or create new)
      try {
        model = mongoose.model<IUser>('User') as Model<IUser>;
      } catch {
        // Model doesn't exist yet, return a default ID
        const timestamp = Date.now().toString().slice(-4);
        return `${prefix}${timestamp}`;
      }
    }
    
    // Find the last student ID with this prefix
    const lastUser = await model.findOne(
      { studentId: new RegExp(`^${prefix}`) }
    ).sort({ createdAt: -1 }).limit(1).lean();
    
    let sequence = 1;
    if (lastUser?.studentId) {
      const lastSequence = parseInt(lastUser.studentId.slice(-4)) || 0;
      sequence = lastSequence + 1;
    }
    
    return `${prefix}${sequence.toString().padStart(4, '0')}`;
  } catch (error) {
    console.error('Error generating student ID:', error);
    // Return a fallback ID if generation fails
    const timestamp = Date.now().toString().slice(-4);
    return `${prefix}${timestamp}`;
  }
}

const UserSchema = new Schema<IUser>(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    studentId: {
      type: String,
      unique: true,
      index: true,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 16,
      max: 100,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    address: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'completed'],
      default: 'pending',
      index: true,
    },
    dateOfBirth: {
      type: Date,
    },
    nid: {
      type: String,
    },
    emergencyContact: {
      type: String,
    },
    emergencyPhone: {
      type: String,
    },
    bloodGroup: {
      type: String,
    },
    occupation: {
      type: String,
    },
    education: {
      type: String,
    },
    // Social media profiles
    facebook: {
      type: String,
    },
    instagram: {
      type: String,
    },
    twitter: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    // Certificate fields
    certificateId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    certificateLink: {
      type: String,
    },
    completionDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Note: Student ID generation is now handled in the API route to avoid Mongoose hook issues
// No pre-save hooks are used to avoid "next is not a function" errors

// Clear any cached model to ensure no old hooks are present
if (mongoose.models.User) {
  delete mongoose.models.User;
}

// Prevent re-compilation during development
const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;

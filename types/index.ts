export interface Package {
  id: string;
  name: string;
  duration: string;
  price: number;
  description: string;
  features: string[];
  isActive: boolean;
  note?: string;
}

export interface Booking {
  id?: string;
  userFirebaseUid: string;
  packageId: string;
  selectedDate: string;
  selectedTime: string;
  status: 'pending' | 'confirmed' | 'rejected';
  phone: string;
  email?: string;
  name: string;
  age: number;
  whyLearning: string;
  address: string;
  previousTraining: boolean;
  // Admin fields
  assignedPackage?: '15-days' | '1-month' | 'old-student';
  fee?: number;
  totalPaid?: number;
  due?: number;
  payments?: Array<{
    amount: number;
    date: Date;
    method: 'cash' | 'bank' | 'other';
    notes?: string;
  }>;
  invoiceNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface User {
  id?: string;
  firebaseUid: string;
  studentId?: string;
  email: string;
  phone: string;
  name: string;
  age?: number;
  gender: 'male' | 'female' | 'other';
  address?: string;
  status?: 'pending' | 'approved' | 'completed';
  dateOfBirth?: Date;
  nid?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  bloodGroup?: string;
  occupation?: string;
  education?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  certificateId?: string;
  certificateLink?: string;
  completionDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Package {
  id: string;
  name: string;
  duration: string;
  price: number;
  description: string;
  features: string[];
  isActive: boolean;
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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface User {
  firebaseUid: string;
  email: string;
  phone: string;
  name?: string;
}

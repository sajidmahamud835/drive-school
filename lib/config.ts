export const config = {
  trainingCenter: {
    name: process.env.NEXT_PUBLIC_TRAINING_CENTER_NAME || 'Drive School',
    address: process.env.NEXT_PUBLIC_TRAINING_CENTER_ADDRESS || '123 Main Street, City, State',
    phone: process.env.NEXT_PUBLIC_TRAINING_CENTER_PHONE || '+1 555 123 4567',
    email: process.env.NEXT_PUBLIC_TRAINING_CENTER_EMAIL || 'info@driveschool.com',
  },
};

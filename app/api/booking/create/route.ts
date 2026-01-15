import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Booking from '@/models/Booking';
import User, { generateStudentId } from '@/models/User';
import { adminAuth } from '@/lib/firebaseAdmin';
import { isValidBookingDate, isValidTimeSlot } from '@/lib/timeSlotUtils';

export async function POST(request: NextRequest) {
  console.log('[Booking Create] ===== Starting booking creation =====');
  try {
    console.log('[Booking Create] Connecting to database...');
    await connectDB();
    console.log('[Booking Create] Database connected');

    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('[Booking Create] No authorization header found');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const idToken = authHeader.split('Bearer ')[1];
    console.log('[Booking Create] Verifying Firebase token...');
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
      console.log('[Booking Create] Token verified, Firebase UID:', decodedToken.uid);
      console.log('[Booking Create] Token email:', decodedToken.email);
    } catch (error: any) {
      console.error('[Booking Create] Token verification failed:', error.message);
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    console.log('[Booking Create] Parsing request body...');
    const body = await request.json();
    console.log('[Booking Create] Request body received:', {
      packageId: body.packageId,
      selectedDate: body.selectedDate,
      selectedTime: body.selectedTime,
      email: body.email,
      name: body.name,
      phone: body.phone ? '***' : undefined,
      age: body.age,
      gender: body.gender,
    });
    const {
      packageId,
      selectedDate,
      selectedTime,
      phone,
      email,
      name,
      age,
      gender,
      whyLearning,
      address,
      previousTraining,
    } = body;

    // Validation
    console.log('[Booking Create] Validating request data...');
    const missingFields: string[] = [];
    if (!packageId) missingFields.push('packageId');
    if (!selectedDate) missingFields.push('selectedDate');
    if (!selectedTime) missingFields.push('selectedTime');
    if (!phone) missingFields.push('phone');
    if (!name) missingFields.push('name');
    if (!age) missingFields.push('age');
    if (!gender) missingFields.push('gender');
    if (!whyLearning) missingFields.push('whyLearning');
    if (!address) missingFields.push('address');
    
    if (missingFields.length > 0) {
      console.error('[Booking Create] Missing required fields:', missingFields);
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    console.log('[Booking Create] Validation passed');

    const bookingDate = new Date(selectedDate);
    
    // Normalize date to start of day for comparison
    bookingDate.setHours(0, 0, 0, 0);
    
    // Validate date (not Friday)
    if (!isValidBookingDate(bookingDate)) {
      return NextResponse.json(
        { success: false, error: 'Bookings are not available on Fridays' },
        { status: 400 }
      );
    }

    // Validate time slot
    if (!isValidTimeSlot(selectedTime)) {
      return NextResponse.json(
        { success: false, error: 'Time slot must be between 7:00 AM and 11:59 AM' },
        { status: 400 }
      );
    }

    // Check for existing booking at same date/time
    console.log('[Booking Create] Checking for existing bookings...');
    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    const existingBooking = await Booking.findOne({
      selectedDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      selectedTime,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (existingBooking) {
      console.error('[Booking Create] Time slot already booked:', {
        existingBookingId: existingBooking._id.toString(),
        selectedDate: existingBooking.selectedDate,
        selectedTime: existingBooking.selectedTime,
      });
      return NextResponse.json(
        { success: false, error: 'This time slot is already booked' },
        { status: 409 }
      );
    }
    console.log('[Booking Create] No conflicting bookings found');

    // Create or update user
    console.log('[Booking Create] Checking for existing user with Firebase UID:', decodedToken.uid);
    let user = await User.findOne({ firebaseUid: decodedToken.uid });
    
    if (!user) {
      console.log('[Booking Create] User not found, creating new user...');
      try {
        // Generate student ID before creating user
        console.log('[Booking Create] Generating student ID...');
        const studentId = await generateStudentId(User);
        console.log('[Booking Create] Generated student ID:', studentId);
        
        // Prepare user data
        const userData = {
          firebaseUid: decodedToken.uid,
          studentId,
          email: email || decodedToken.email || '',
          phone,
          name,
          age,
          gender,
          address,
          status: 'pending',
        };
        console.log('[Booking Create] Creating user with data:', {
          firebaseUid: userData.firebaseUid,
          studentId: userData.studentId,
          email: userData.email,
          phone: userData.phone,
          name: userData.name,
          age: userData.age,
          gender: userData.gender,
        });
        
        // Try User.create() first, but if it fails with "next is not a function", use collection.insertOne
        try {
          console.log('[Booking Create] Attempting User.create()...');
          user = await User.create(userData);
          console.log('[Booking Create] User created successfully with User.create():', {
            id: user._id.toString(),
            studentId: user.studentId,
            email: user.email,
          });
        } catch (createError: any) {
          // If error is about "next is not a function", use collection.insertOne as fallback
          if (createError.message && createError.message.includes('next is not a function')) {
            console.log('[Booking Create] User.create() failed with hook error, using collection.insertOne() as fallback...');
            const UserCollection = User.collection;
            const insertResult = await UserCollection.insertOne(userData);
            console.log('[Booking Create] User inserted via collection, finding created user...');
            
            // Find the created user
            user = await User.findById(insertResult.insertedId);
            if (!user) {
              // Fallback: find by firebaseUid
              user = await User.findOne({ firebaseUid: decodedToken.uid });
            }
            
            if (!user) {
              throw new Error('User was created but could not be retrieved');
            }
            
            console.log('[Booking Create] User created successfully via collection.insertOne():', {
              id: user._id.toString(),
              studentId: user.studentId,
              email: user.email,
            });
          } else {
            // Re-throw if it's a different error
            throw createError;
          }
        }
      } catch (userError: any) {
        console.error('[Booking Create] User creation error:', userError);
        console.error('[Booking Create] Error details:', {
          message: userError.message,
          code: userError.code,
          keyPattern: userError.keyPattern,
          keyValue: userError.keyValue,
          stack: userError.stack,
        });
        
        // If user creation fails, try to find existing user
        // (user might have been created in parallel or there was a validation error)
        console.log('[Booking Create] Retrying to find user after creation error...');
        user = await User.findOne({ firebaseUid: decodedToken.uid });
        
        if (!user) {
          // Also try to find by email in case firebaseUid wasn't set
          if (email || decodedToken.email) {
            console.log('[Booking Create] Trying to find user by email:', email || decodedToken.email);
            user = await User.findOne({ email: email || decodedToken.email });
          }
        }
        
        if (!user) {
          const errorMessage = userError.message || userError.toString();
          console.error('[Booking Create] User not found after error, throwing exception');
          throw new Error(`Failed to create user profile: ${errorMessage}`);
        } else {
          console.log('[Booking Create] Found existing user after creation error:', {
            id: user._id.toString(),
            studentId: user.studentId,
            email: user.email,
          });
        }
      }
    } else {
      console.log('[Booking Create] User already exists:', {
        id: user._id.toString(),
        studentId: user.studentId,
        email: user.email,
        name: user.name,
      });
      
      // Update user info if provided
      const updateData: any = {};
      if (email && email !== user.email) {
        updateData.email = email;
        console.log('[Booking Create] Will update email:', email);
      }
      if (phone && phone !== user.phone) {
        updateData.phone = phone;
        console.log('[Booking Create] Will update phone:', phone);
      }
      if (name && name !== user.name) {
        updateData.name = name;
        console.log('[Booking Create] Will update name:', name);
      }
      if (age && age !== user.age) {
        updateData.age = age;
        console.log('[Booking Create] Will update age:', age);
      }
      if (gender && gender !== user.gender) {
        updateData.gender = gender;
        console.log('[Booking Create] Will update gender:', gender);
      }
      if (address && address !== user.address) {
        updateData.address = address;
        console.log('[Booking Create] Will update address');
      }
      
      // Use findOneAndUpdate to avoid save() hook issues
      if (Object.keys(updateData).length > 0) {
        console.log('[Booking Create] Updating user with data:', updateData);
        user = await User.findOneAndUpdate(
          { firebaseUid: decodedToken.uid },
          { $set: updateData },
          { new: true }
        );
        console.log('[Booking Create] User updated successfully');
      } else {
        console.log('[Booking Create] No updates needed for user');
      }
    }

    // Create booking
    console.log('[Booking Create] Creating booking...');
    const bookingData = {
      userFirebaseUid: decodedToken.uid,
      packageId,
      selectedDate: bookingDate,
      selectedTime,
      status: 'pending',
      phone,
      email: email || decodedToken.email,
      name,
      age,
      whyLearning,
      address,
      previousTraining: previousTraining === true || previousTraining === 'yes',
    };
    console.log('[Booking Create] Booking data:', {
      userFirebaseUid: bookingData.userFirebaseUid,
      packageId: bookingData.packageId,
      selectedDate: bookingData.selectedDate,
      selectedTime: bookingData.selectedTime,
      status: bookingData.status,
    });
    
    const booking = await Booking.create(bookingData);
    console.log('[Booking Create] Booking created successfully:', {
      id: booking._id.toString(),
      status: booking.status,
    });

    // Fetch user to get studentId for response
    const userForResponse = await User.findOne({ firebaseUid: decodedToken.uid });
    
    const response = {
      success: true,
      booking: {
        id: booking._id.toString(),
        userFirebaseUid: booking.userFirebaseUid,
        packageId: booking.packageId,
        selectedDate: booking.selectedDate.toISOString(),
        selectedTime: booking.selectedTime,
        status: booking.status,
        phone: booking.phone,
        email: booking.email,
        name: booking.name,
        age: booking.age,
        whyLearning: booking.whyLearning,
        address: booking.address,
        previousTraining: booking.previousTraining,
      },
      studentId: userForResponse?.studentId || null,
    };
    
    console.log('[Booking Create] ===== Booking creation completed successfully =====');
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('[Booking Create] ===== ERROR in booking creation =====');
    console.error('[Booking Create] Error message:', error.message);
    console.error('[Booking Create] Error stack:', error.stack);
    console.error('[Booking Create] Full error object:', {
      name: error.name,
      message: error.message,
      code: error.code,
      keyPattern: error.keyPattern,
      keyValue: error.keyValue,
    });
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create booking' },
      { status: 500 }
    );
  }
}

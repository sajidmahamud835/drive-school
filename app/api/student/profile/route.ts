import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { adminAuth } from '@/lib/firebaseAdmin';

// Get student profile
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const idToken = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        firebaseUid: user.firebaseUid,
        studentId: user.studentId,
        email: user.email,
        phone: user.phone,
        name: user.name,
        age: user.age,
        gender: user.gender,
        address: user.address,
        status: user.status,
        dateOfBirth: user.dateOfBirth,
        nid: user.nid,
        emergencyContact: user.emergencyContact,
        emergencyPhone: user.emergencyPhone,
        bloodGroup: user.bloodGroup,
        occupation: user.occupation,
        education: user.education,
        facebook: user.facebook,
        instagram: user.instagram,
        twitter: user.twitter,
        linkedin: user.linkedin,
        certificateId: user.certificateId,
        certificateLink: user.certificateLink,
        completionDate: user.completionDate,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// Update student profile
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const idToken = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      age,
      phone,
      address,
      dateOfBirth,
      nid,
      emergencyContact,
      emergencyPhone,
      bloodGroup,
      occupation,
      education,
      facebook,
      instagram,
      twitter,
      linkedin,
    } = body;

    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Update allowed fields
    if (name !== undefined) user.name = name;
    if (age !== undefined) user.age = age;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : undefined;
    if (nid !== undefined) user.nid = nid;
    if (emergencyContact !== undefined) user.emergencyContact = emergencyContact;
    if (emergencyPhone !== undefined) user.emergencyPhone = emergencyPhone;
    if (bloodGroup !== undefined) user.bloodGroup = bloodGroup;
    if (occupation !== undefined) user.occupation = occupation;
    if (education !== undefined) user.education = education;

    await user.save();

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        firebaseUid: user.firebaseUid,
        studentId: user.studentId,
        email: user.email,
        phone: user.phone,
        name: user.name,
        age: user.age,
        gender: user.gender,
        address: user.address,
        status: user.status,
        dateOfBirth: user.dateOfBirth,
        nid: user.nid,
        emergencyContact: user.emergencyContact,
        emergencyPhone: user.emergencyPhone,
        bloodGroup: user.bloodGroup,
        occupation: user.occupation,
        education: user.education,
        facebook: user.facebook,
        instagram: user.instagram,
        twitter: user.twitter,
        linkedin: user.linkedin,
        certificateId: user.certificateId,
        certificateLink: user.certificateLink,
        completionDate: user.completionDate,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}

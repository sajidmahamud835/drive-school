import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { adminAuth } from '@/lib/firebaseAdmin';

const ADMIN_UIDS = (process.env.ADMIN_FIREBASE_UIDS || '9Z73mxsFpDZvqdyZ7nNRc6vB7522').split(',').filter(Boolean);

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Verify admin authentication
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

    // Check if user is admin
    if (!ADMIN_UIDS.includes(decodedToken.uid)) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json(
        { success: false, error: 'Student ID is required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ studentId });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Student not found' },
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
    console.error('Admin search student error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to search student' },
      { status: 500 }
    );
  }
}

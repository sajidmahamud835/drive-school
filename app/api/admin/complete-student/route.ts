import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { adminAuth } from '@/lib/firebaseAdmin';

const ADMIN_UIDS = (process.env.ADMIN_FIREBASE_UIDS || '9Z73mxsFpDZvqdyZ7nNRc6vB7522').split(',').filter(Boolean);

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { studentId } = body;

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

    // Generate certificate ID and link
    const year = new Date().getFullYear();
    const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase();
    const certificateId = `CERT-${year}-${randomStr}`;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'http://localhost:3000';
    const certificateLink = `${baseUrl}/certificate/${certificateId}`;

    // Update user status and certificate info
    user.status = 'completed';
    user.certificateId = certificateId;
    user.certificateLink = certificateLink;
    user.completionDate = new Date();
    
    await user.save();

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        studentId: user.studentId,
        status: user.status,
        certificateId: user.certificateId,
        certificateLink: user.certificateLink,
        completionDate: user.completionDate,
      },
    });
  } catch (error: any) {
    console.error('Admin complete student error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to complete student' },
      { status: 500 }
    );
  }
}

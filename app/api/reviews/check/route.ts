import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import { adminAuth } from '@/lib/firebaseAdmin';

/**
 * Check if user has already submitted a review
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Verify authentication
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

    // Check if user has submitted a review
    const review = await Review.findOne({ userFirebaseUid: decodedToken.uid });

    return NextResponse.json({
      success: true,
      hasReview: !!review,
      review: review ? {
        id: review._id.toString(),
        rating: review.rating,
        text: review.text,
        status: review.status,
      } : null,
    });
  } catch (error: any) {
    console.error('Error checking review:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to check review' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import User from '@/models/User';
import { adminAuth } from '@/lib/firebaseAdmin';

/**
 * API route for students to submit reviews
 */
export async function POST(request: NextRequest) {
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

    // Get user from database
    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has already submitted an approved review
    // Allow pending/rejected reviews to be resubmitted
    const existingReview = await Review.findOne({ 
      userFirebaseUid: decodedToken.uid,
      status: 'approved'
    });
    if (existingReview) {
      return NextResponse.json(
        { success: false, error: 'আপনি ইতিমধ্যে একটি রিভিউ দিয়েছেন' },
        { status: 400 }
      );
    }

    // If there's a pending or rejected review, update it instead of creating new
    const existingPendingReview = await Review.findOne({ 
      userFirebaseUid: decodedToken.uid,
      status: { $in: ['pending', 'rejected'] }
    });
    
    if (existingPendingReview) {
      // Update existing review
      existingPendingReview.rating = parseInt(rating);
      existingPendingReview.text = text.trim();
      existingPendingReview.status = 'pending';
      await existingPendingReview.save();

      return NextResponse.json({
        success: true,
        review: {
          id: existingPendingReview._id.toString(),
          rating: existingPendingReview.rating,
          text: existingPendingReview.text,
          status: existingPendingReview.status,
        },
        message: 'রিভিউ আপডেট করা হয়েছে। অ্যাডমিন অনুমোদনের পর এটি প্রকাশিত হবে।',
      });
    }

    const body = await request.json();
    const { rating, text } = body;

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'রেটিং ১ থেকে ৫ এর মধ্যে হতে হবে' },
        { status: 400 }
      );
    }

    if (!text || text.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'রিভিউ কমপক্ষে ১০ অক্ষর হতে হবে' },
        { status: 400 }
      );
    }

    // Create review
    const review = await Review.create({
      userFirebaseUid: decodedToken.uid,
      studentId: user.studentId,
      studentName: user.name,
      rating: parseInt(rating),
      text: text.trim(),
      status: 'pending', // Admin will approve
    });

    return NextResponse.json({
      success: true,
      review: {
        id: review._id.toString(),
        rating: review.rating,
        text: review.text,
        status: review.status,
      },
      message: 'রিভিউ সফলভাবে জমা দেওয়া হয়েছে। অ্যাডমিন অনুমোদনের পর এটি প্রকাশিত হবে।',
    });
  } catch (error: any) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create review' },
      { status: 500 }
    );
  }
}

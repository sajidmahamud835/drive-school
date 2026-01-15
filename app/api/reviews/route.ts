import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';

/**
 * API route to fetch approved reviews from database
 */
export async function GET() {
  try {
    await connectDB();

    // Fetch only approved reviews, sorted by newest first
    const reviews = await Review.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // Calculate average rating and total count
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
      : 0;

    return NextResponse.json({
      success: true,
      reviews: reviews.map((review) => ({
        id: review._id.toString(),
        author_name: review.studentName,
        rating: review.rating,
        text: review.text,
        time: review.createdAt.getTime(),
      })),
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

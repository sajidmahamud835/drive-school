import { NextResponse } from 'next/server';
import { config } from '@/lib/config';

/**
 * API route to fetch Google Maps reviews
 * 
 * Note: This requires Google Places API key
 * To use this:
 * 1. Get Google Places API key from Google Cloud Console
 * 2. Add GOOGLE_PLACES_API_KEY to environment variables
 * 3. Get the Place ID from Google Maps (or use the one in config)
 * 
 * For now, this returns mock data. Replace with actual API call when ready.
 */

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = config.trainingCenter.googleMapsPlaceId || 
      'ChIJN1t_tDeuEmsRUsoyG83frY4'; // Default place ID (replace with actual)

    // If API key is not configured, return mock data
    if (!apiKey) {
      return NextResponse.json({
        success: true,
        reviews: [
          {
            author_name: 'আহমেদ',
            rating: 5,
            text: 'চমৎকার ড্রাইভিং স্কুল! প্রশিক্ষকরা ধৈর্যশীল এবং পেশাদার। আমি প্রথমবারেই পাস করেছি!',
            time: Date.now() - 86400000, // 1 day ago
          },
          {
            author_name: 'ফাতিমা',
            rating: 5,
            text: 'অসাধারণ অভিজ্ঞতা! আমি আত্মবিশ্বাসের সাথে গাড়ি চালানো শিখেছি। সুপারিশ করছি!',
            time: Date.now() - 172800000, // 2 days ago
          },
          {
            author_name: 'করিম',
            rating: 5,
            text: 'শিক্ষকরা খুব সহায়ক এবং বুঝিয়ে দেন। পার্কিং থেকে হাইওয়ে সবকিছুই শিখেছি।',
            time: Date.now() - 259200000, // 3 days ago
          },
        ],
        totalReviews: 150,
        averageRating: 5.0,
        message: 'Using mock data. Configure GOOGLE_PLACES_API_KEY to fetch real reviews.',
      });
    }

    // TODO: Implement actual Google Places API call
    // const response = await fetch(
    //   `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`
    // );
    // const data = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'Google Places API integration pending. Add GOOGLE_PLACES_API_KEY to enable.',
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

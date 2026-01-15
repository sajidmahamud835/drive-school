'use client';

import { useState, useEffect } from 'react';

interface Review {
  id: string;
  author_name: string;
  rating: number;
  text: string;
  time: number;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number>(5.0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/reviews');
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.reviews || []);
        setAverageRating(data.averageRating || 5.0);
        setTotalReviews(data.totalReviews || 0);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'আজ';
    if (diffDays === 2) return 'গতকাল';
    if (diffDays < 7) return `${diffDays} দিন আগে`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} সপ্তাহ আগে`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} মাস আগে`;
    return `${Math.floor(diffDays / 365)} বছর আগে`;
  };

  const displayReviews = reviews.slice(0, 6); // Show first 6 reviews

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-3 bg-tinder/10 rounded-full mb-6 border-2 border-tinder/20">
            <span className="text-tinder font-bold text-lg">⭐ রিভিউ</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
            <span className="block">শিক্ষার্থীদের</span>
            <span className="block text-tinder">মতামত</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed mb-8">
            আমাদের শিক্ষার্থীরা কী বলছেন দেখুন
          </p>
          
          {/* Rating Display */}
          {loading ? (
            <div className="flex items-center justify-center gap-4 mb-10 bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg border-2 border-yellow-200 max-w-md mx-auto">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tinder"></div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-4 mb-10 bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg border-2 border-yellow-200 max-w-md mx-auto">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-12 h-12 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <div>
                <span className="text-5xl font-bold text-gray-900 block">{averageRating.toFixed(1)}</span>
                <span className="text-gray-600 text-lg font-medium">{totalReviews}+ রিভিউ</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Review Cards */}
        {loading ? (
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-xl border-2 border-gray-100 animate-pulse">
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : displayReviews.length > 0 ? (
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-8 rounded-2xl shadow-xl border-2 border-gray-100 hover:border-tinder transition-all transform hover:scale-105"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-tinder rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                    {getInitial(review.author_name)}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-xl text-gray-900">{review.author_name}</p>
                    <p className="text-sm text-gray-500 mb-2">{formatDate(review.time)}</p>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, j) => (
                        <svg 
                          key={j} 
                          className={`w-5 h-5 ${j < review.rating ? 'fill-current' : 'fill-gray-300'}`} 
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-800 leading-relaxed text-lg font-medium italic">
                  "{review.text}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">এখনও কোন রিভিউ নেই</p>
          </div>
        )}
      </div>
    </section>
  );
}

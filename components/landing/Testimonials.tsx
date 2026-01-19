'use client';

import { useState, useEffect, useMemo } from 'react';
import testimonialsData from '@/data/testimonials.json';

interface Testimonial {
  id: string;
  name: string;
  videoUrl: string;
  tags: string[];
  order: number;
}

/**
 * Randomize array using Fisher-Yates shuffle algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Handle Facebook video click - open in new tab
 * Facebook share links don't work well with iframe embeds, so we open them directly
 */
function handleVideoClick(videoUrl: string) {
  window.open(videoUrl, '_blank', 'noopener,noreferrer');
}

export default function Testimonials() {
  const [randomizedTestimonials, setRandomizedTestimonials] = useState<Testimonial[]>([]);

  // Randomize testimonials on component mount and when data changes
  useEffect(() => {
    const testimonials = testimonialsData.testimonials as Testimonial[];
    const shuffled = shuffleArray(testimonials);
    setRandomizedTestimonials(shuffled);
  }, []);

  // Show only first 3 videos (or all if less than 3)
  const displayTestimonials = useMemo(() => {
    return randomizedTestimonials.slice(0, 3);
  }, [randomizedTestimonials]);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-3 bg-tinder/10 rounded-full mb-6 border-2 border-tinder/20">
            <span className="text-tinder font-bold text-lg">🎥 সাক্ষাৎকার</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
            <span className="block">আমাদের শিক্ষার্থীরা</span>
            <span className="block text-tinder">কী বলছেন</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
            আমাদের ড্রাইভিং স্কুলের স্নাতকদের বাস্তব অভিজ্ঞতা
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {displayTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-tinder transition-all transform hover:scale-105 shadow-lg cursor-pointer"
              onClick={() => handleVideoClick(testimonial.videoUrl)}
            >
              <div className="aspect-video bg-gradient-to-br from-tinder/20 via-red-500/20 to-pink-500/20 flex items-center justify-center relative group overflow-hidden">
                {/* Background gradient with video preview effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-tinder/30 via-red-500/30 to-pink-500/30 group-hover:from-tinder/40 group-hover:via-red-500/40 group-hover:to-pink-500/40 transition-all duration-300"></div>
                
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/5 transition-colors pointer-events-none z-10">
                  <div className="w-20 h-20 rounded-full bg-white/95 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                    <svg className="w-12 h-12 text-tinder ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                
                {/* Video indicator text */}
                <div className="absolute bottom-4 left-4 right-4 text-center pointer-events-none z-10">
                  <p className="text-white/90 font-semibold text-sm bg-black/30 px-3 py-1 rounded-full inline-block">
                    Facebook ভিডিও দেখুন
                  </p>
                </div>
              </div>
              <div className="p-6">
                <p className="font-bold text-xl text-gray-900">{testimonial.name}</p>
                <p className="text-gray-600 mt-2 text-base">শিক্ষার্থীর সাক্ষাৎকার</p>
                {testimonial.tags && testimonial.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {testimonial.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-tinder/10 text-tinder text-xs font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

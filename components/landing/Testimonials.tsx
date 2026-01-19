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

interface ResolvedVideo {
  id: string;
  embedUrl: string;
  originalUrl: string;
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

export default function Testimonials() {
  const [randomizedTestimonials, setRandomizedTestimonials] = useState<Testimonial[]>([]);
  const [resolvedVideos, setResolvedVideos] = useState<Record<string, ResolvedVideo>>({});
  const [selectedVideo, setSelectedVideo] = useState<ResolvedVideo | null>(null);
  const [loading, setLoading] = useState(true);

  // Resolve Facebook video URLs to embeddable URLs
  useEffect(() => {
    const resolveVideos = async () => {
      setLoading(true);
      const testimonials = testimonialsData.testimonials as Testimonial[];
      const shuffled = shuffleArray(testimonials);
      setRandomizedTestimonials(shuffled);

      // Resolve all video URLs
      const resolved: Record<string, ResolvedVideo> = {};
      
      for (const testimonial of shuffled) {
        try {
          const response = await fetch(
            `/api/facebook/resolve-video?url=${encodeURIComponent(testimonial.videoUrl)}`
          );
          const data = await response.json();
          
          if (data.success && data.embedUrl) {
            resolved[testimonial.id] = {
              id: testimonial.id,
              embedUrl: data.embedUrl,
              originalUrl: testimonial.videoUrl,
            };
          } else {
            // Fallback: use original URL formatted for embedding
            resolved[testimonial.id] = {
              id: testimonial.id,
              embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(testimonial.videoUrl)}&show_text=false&width=734&height=413`,
              originalUrl: testimonial.videoUrl,
            };
          }
        } catch (error) {
          console.error(`Error resolving video ${testimonial.id}:`, error);
          // Fallback: use original URL formatted for embedding
          resolved[testimonial.id] = {
            id: testimonial.id,
            embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(testimonial.videoUrl)}&show_text=false&width=734&height=413`,
            originalUrl: testimonial.videoUrl,
          };
        }
      }
      
      setResolvedVideos(resolved);
      setLoading(false);
    };

    resolveVideos();
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl overflow-hidden border-2 border-gray-200 animate-pulse">
                <div className="aspect-[9/16] bg-gray-200 max-w-sm mx-auto"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))
          ) : (
            displayTestimonials.map((testimonial) => {
              const resolved = resolvedVideos[testimonial.id];
              return (
                <div
                  key={testimonial.id}
                  className="bg-gray-50 rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-tinder transition-all transform hover:scale-105 shadow-lg cursor-pointer"
                  onClick={() => resolved && setSelectedVideo(resolved)}
                >
                  <div className="aspect-[9/16] bg-black relative group overflow-hidden max-w-sm mx-auto">
                    {/* Facebook Video Embed */}
                    {resolved ? (
                      <iframe
                        src={resolved.embedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 'none', overflow: 'hidden' }}
                        scrolling="no"
                        frameBorder="0"
                        allowFullScreen={true}
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        className="w-full h-full"
                        loading="lazy"
                      ></iframe>
                    ) : (
                      // Fallback loading state
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-tinder/20 via-red-500/20 to-pink-500/20">
                        <div className="w-20 h-20 rounded-full bg-white/95 flex items-center justify-center shadow-2xl">
                          <svg className="w-12 h-12 text-tinder ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    )}
                    
                    {/* Play button overlay on hover */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none z-10">
                      <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform opacity-0 group-hover:opacity-100">
                        <svg className="w-12 h-12 text-tinder ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
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
            );
          })
          )}
        </div>

        {/* Video Modal for Full Screen */}
        {selectedVideo && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={selectedVideo.embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 'none', overflow: 'hidden' }}
                  scrolling="no"
                  frameBorder="0"
                  allowFullScreen={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

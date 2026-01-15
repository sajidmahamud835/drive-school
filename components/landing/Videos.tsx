'use client';

import { useState } from 'react';

export default function Videos() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const videos = [
    {
      id: 1,
      title: 'ড্রাইভিং লেসন - বেসিক',
      thumbnail: '/images/video-thumb-1.jpg',
      videoUrl: '/videos/driving-basics.mp4',
    },
    {
      id: 2,
      title: 'পার্কিং টেকনিক',
      thumbnail: '/images/video-thumb-2.jpg',
      videoUrl: '/videos/parking.mp4',
    },
    {
      id: 3,
      title: 'হাইওয়ে ড্রাইভিং',
      thumbnail: '/images/video-thumb-3.jpg',
      videoUrl: '/videos/highway.mp4',
    },
    {
      id: 4,
      title: 'রোড টেস্ট প্রস্তুতি',
      thumbnail: '/images/video-thumb-4.jpg',
      videoUrl: '/videos/road-test.mp4',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-3 bg-tinder/10 rounded-full mb-6 border-2 border-tinder/20">
            <span className="text-tinder font-bold text-lg">🎬 প্রশিক্ষণ ভিডিও</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
            <span className="block">আমাদের প্রশিক্ষণ</span>
            <span className="block text-tinder">ভিডিও দেখুন</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
            আমাদের পেশাদার প্রশিক্ষকদের কাজ দেখুন
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-tinder transition-all cursor-pointer border-2 border-gray-200 hover:border-tinder transform hover:scale-105"
              onClick={() => setSelectedVideo(video.videoUrl)}
            >
              <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative group">
                <p className="text-gray-600 font-medium text-base">ভিডিও থাম্বনেইল</p>
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                  <div className="w-20 h-20 rounded-full bg-white/95 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                    <svg className="w-12 h-12 text-tinder ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg text-gray-900">{video.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Video Modal */}
        {selectedVideo && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border-4 border-white">
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-colors backdrop-blur-sm"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <p className="text-xl font-bold mb-2">ভিডিও প্লেয়ার</p>
                    <p className="text-gray-400">ভিডিও শীঘ্রই আসছে</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

'use client';

import { useState } from 'react';

export default function Videos() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const videos = [
    {
      id: 1,
      title: 'Driving Lesson - Basics',
      thumbnail: '/images/video-thumb-1.jpg', // Placeholder
      videoUrl: '/videos/driving-basics.mp4', // Placeholder
    },
    {
      id: 2,
      title: 'Parking Techniques',
      thumbnail: '/images/video-thumb-2.jpg', // Placeholder
      videoUrl: '/videos/parking.mp4', // Placeholder
    },
    {
      id: 3,
      title: 'Highway Driving',
      thumbnail: '/images/video-thumb-3.jpg', // Placeholder
      videoUrl: '/videos/highway.mp4', // Placeholder
    },
    {
      id: 4,
      title: 'Road Test Preparation',
      thumbnail: '/images/video-thumb-4.jpg', // Placeholder
      videoUrl: '/videos/road-test.mp4', // Placeholder
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Watch Our Training Videos</h2>
          <p className="text-lg text-gray-600">
            See our professional instructors in action
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedVideo(video.videoUrl)}
            >
              <div className="aspect-video bg-gray-300 flex items-center justify-center relative group">
                <p className="text-gray-500">Video Thumbnail</p>
                {/* Replace with actual thumbnail image when available */}
                {/* <Image src={video.thumbnail} alt={video.title} fill className="object-cover" /> */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{video.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Video Modal */}
        {selectedVideo && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {/* Replace with actual video element when videos are available */}
                <div className="w-full h-full flex items-center justify-center text-white">
                  <p>Video Player Placeholder</p>
                  {/* <video controls autoPlay className="w-full h-full">
                    <source src={selectedVideo} type="video/mp4" />
                  </video> */}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

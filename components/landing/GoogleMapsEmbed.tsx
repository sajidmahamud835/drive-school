'use client';

import { config } from '@/lib/config';

export default function GoogleMapsEmbed() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            <span className="block">আমাদের</span>
            <span className="block text-tinder">অবস্থান</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            {config.trainingCenter.address}
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-tinder/20">
            <iframe
              src={config.trainingCenter.googleMapsEmbedUrl}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          </div>
          
          <div className="mt-6 text-center">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.trainingCenter.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-tinder text-white font-bold text-lg rounded-full hover:bg-red-600 transition-colors shadow-tinder transform hover:scale-105"
            >
              <span>Google Maps এ খুলুন</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

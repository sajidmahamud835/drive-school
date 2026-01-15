'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { config } from '@/lib/config';

export default function Hero() {
  const [animatedCount, setAnimatedCount] = useState(0);

  useEffect(() => {
    const target = 150;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    const stepDuration = duration / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setAnimatedCount(target);
        clearInterval(timer);
      } else {
        setAnimatedCount(Math.floor(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
      {/* Gradient Background */}
      <div className="absolute inset-0 gradient-tinder opacity-5"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Social Proof Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/95 backdrop-blur-sm rounded-full shadow-xl mb-8 animate-bounce border-2 border-green-200">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-base font-bold text-gray-800">
              {animatedCount}+ সফল শিক্ষার্থী আমাদের সাথে আস্থা রাখছেন
            </span>
          </div>

          {/* Main Headline - High Converting Formula */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight text-gray-900">
            <span className="block mb-3">আপনার ড্রাইভিং</span>
            <span className="block gradient-tinder bg-clip-text text-transparent">
              স্বপ্নকে বাস্তবে পরিণত করুন
            </span>
          </h1>

          {/* Subheadline - Benefit focused */}
          <p className="text-xl md:text-2xl lg:text-3xl mb-4 text-gray-800 font-semibold max-w-3xl mx-auto leading-relaxed">
            পেশাদার প্রশিক্ষকদের সাথে শিখুন
          </p>
          <p className="text-lg md:text-xl mb-10 text-gray-600 max-w-2xl mx-auto leading-relaxed">
            <span className="font-bold text-tinder text-xl">{animatedCount}+</span> শিক্ষার্থী সফলতার সাথে গাড়ি চালানো শিখেছেন | 
            <span className="font-bold text-green-600"> ৯৫%</span> পাস রেট | 
            <span className="font-bold text-yellow-500"> ৫★</span> রেটিং
          </p>

          {/* High CTA Button - Prominent */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/booking" className="w-full sm:w-auto group">
              <button className="w-full sm:w-auto px-12 py-6 bg-tinder hover:bg-red-600 text-white text-xl font-bold rounded-full shadow-tinder transform transition-all hover:scale-110 active:scale-95 group-hover:shadow-2xl">
                <span className="flex items-center justify-center gap-3">
                  <span className="text-2xl">🚗</span>
                  <span>এখনই বুক করুন - শুরু করুন আজই</span>
                  <span className="text-2xl">→</span>
                </span>
              </button>
            </Link>
            <a
              href={`tel:${config.trainingCenter.phone}`}
              className="w-full sm:w-auto px-12 py-6 bg-white border-3 border-tinder text-tinder text-xl font-bold rounded-full hover:bg-pink-50 transform transition-all hover:scale-110 active:scale-95 shadow-lg"
            >
              <span className="flex items-center justify-center gap-2">
                <span className="text-2xl">📞</span>
                <span>{config.trainingCenter.phone}</span>
              </span>
            </a>
          </div>

          {/* Trust Indicators - Clear and readable */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border-2 border-gray-100 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold text-tinder mb-2">{animatedCount}+</div>
              <div className="text-gray-700 font-semibold text-lg">সফল শিক্ষার্থী</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold text-green-600 mb-2">৯৫%</div>
              <div className="text-gray-700 font-semibold text-lg">পাস রেট</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-5xl font-bold text-yellow-500 mb-2">৫★</div>
              <div className="text-gray-700 font-semibold text-lg">গুগল রেটিং</div>
            </div>
          </div>

          {/* Urgency Element */}
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-700 font-semibold">
              ⚡ সীমিত স্লট উপলব্ধ - আজই আপনার স্থান নিশ্চিত করুন
            </p>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-16 animate-bounce">
            <svg className="w-8 h-8 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

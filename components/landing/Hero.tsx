'use client';

import Button from '../ui/Button';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Master the Road with Expert Driving Training
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Professional driving lessons tailored to your needs. Join 150+ satisfied students who passed their tests with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/booking">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Start Your Journey
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
              Watch Our Videos
            </Button>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">150+</span>
              <span className="text-blue-200">Happy Students</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">95%</span>
              <span className="text-blue-200">Pass Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">5★</span>
              <span className="text-blue-200">Google Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

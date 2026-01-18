'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { Package } from '@/types';
import Link from 'next/link';
import { config } from '@/lib/config';
import { trackPackageSelect } from '@/lib/analytics';

const packages: Package[] = [
  {
    id: '15-days',
    name: '১৫ দিনের প্যাকেজ',
    duration: '15 days',
    price: 0,
    description: 'দ্রুত শেখার জন্য পারফেক্ট',
    features: [
      '১৫ দিনের ইন্টেনসিভ ট্রেনিং',
      'লক্ষ্য অনুযায়ী সিডিউল',
      'রোড টেস্ট প্রস্তুতি',
      'সার্টিফিকেট অফ কমপ্লিশন',
    ],
    isActive: true,
  },
  {
    id: '1-month',
    name: 'এক মাসের প্যাকেজ',
    duration: '1 month',
    price: 0,
    description: 'ব্যাপক প্রশিক্ষণ প্রোগ্রাম',
    features: [
      '৩০ দিনের স্ট্রাকচার্ড ট্রেনিং',
      'থিওরি ও প্র্যাকটিক্যাল লেসন',
      'হাইওয়ে ড্রাইভিং এক্সপেরিয়েন্স',
      'পার্কিং টেকনিক',
      'রোড টেস্ট প্রস্তুতি',
    ],
    isActive: true,
  },
  {
    id: 'pay-as-you-go',
    name: 'পে অ্যাজ ইউ গো',
    duration: 'Flexible',
    price: 0,
    description: 'অতিরিক্ত অনুশীলনের জন্য',
    note: 'শুধুমাত্র সম্পূর্ণ কোর্স সম্পন্নকারী শিক্ষার্থীদের জন্য',
    features: [
      'লক্ষ্য অনুযায়ী সিডিউল',
      'সেশন প্রতি পেমেন্ট',
      'নির্দিষ্ট স্কিল প্র্যাকটিস',
      'দীর্ঘমেয়াদী কমিটমেন্ট নেই',
      'সম্পূর্ণ কোর্স সম্পন্নকারীদের জন্য',
    ],
    isActive: true,
  },
];

export default function Packages() {
  const [hoveredPackage, setHoveredPackage] = useState<string | null>(null);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-3 bg-tinder/10 rounded-full mb-6 border-2 border-tinder/20">
            <span className="text-tinder font-bold text-lg">📦 প্যাকেজসমূহ</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
            <span className="block">আপনার জন্য</span>
            <span className="block text-tinder">সঠিক প্যাকেজ বাছুন</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
            আপনার লক্ষ্য ও সময়সূচির সাথে মানানসই প্যাকেজ নির্বাচন করুন
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => {
            const isHovered = hoveredPackage === pkg.id;
            const isPopular = pkg.id === '1-month';
            
            return (
              <div
                key={pkg.id}
                className="relative transform transition-all duration-300 hover:scale-105"
                onMouseEnter={() => setHoveredPackage(pkg.id)}
                onMouseLeave={() => setHoveredPackage(null)}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <span className="px-5 py-1.5 bg-tinder text-white text-sm font-bold rounded-full shadow-lg border-2 border-white whitespace-nowrap">
                      ⭐ সর্বাধিক জনপ্রিয়
                    </span>
                  </div>
                )}
                
                <Card 
                  className={`h-full flex flex-col transition-all duration-300 bg-white ${
                    isHovered 
                      ? 'shadow-tinder border-3 border-tinder' 
                      : 'border-2 border-gray-200 hover:border-tinder'
                  } ${isPopular ? 'ring-4 ring-tinder/20 shadow-2xl pt-6' : ''}`}
                >
                  <CardHeader className={`text-center pb-6 ${isPopular ? 'pt-10' : 'pt-8'}`}>
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                      isPopular ? 'bg-tinder text-white' : 'bg-gray-100 text-gray-700'
                    } text-4xl font-bold transition-all duration-300 ${isHovered ? 'scale-110 rotate-12' : ''}`}>
                      {pkg.id === '15-days' ? '⚡' : pkg.id === '1-month' ? '🎯' : '🔄'}
                    </div>
                    <CardTitle className="text-2xl md:text-3xl mb-3 text-gray-900 font-bold">{pkg.name}</CardTitle>
                    <p className="text-gray-700 text-base font-medium">{pkg.description}</p>
                    {pkg.id === 'pay-as-you-go' && (
                      <div className="mt-3 px-4 py-2 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                        <p className="text-yellow-800 text-sm font-bold">
                          ⚠️ শুধুমাত্র সম্পূর্ণ কোর্স সম্পন্নকারী শিক্ষার্থীদের জন্য
                        </p>
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent className="flex-grow flex flex-col px-8">
                    <ul className="space-y-4 mb-8 flex-grow">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start text-base">
                          <span className={`mr-3 text-xl ${isPopular ? 'text-tinder' : 'text-green-600'} font-bold`}>
                            ✓
                          </span>
                          <span className="text-gray-800 leading-relaxed font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link 
                      href={`/booking?package=${pkg.id}`} 
                      className="block"
                      onClick={() => trackPackageSelect(pkg.id, pkg.name, pkg.price)}
                    >
                      <Button
                        variant={isPopular ? 'primary' : 'outline'}
                        className={`w-full font-bold py-5 rounded-xl text-lg transition-all ${
                          isPopular 
                            ? 'bg-tinder hover:bg-red-600 text-white shadow-tinder' 
                            : 'border-3 border-tinder text-tinder hover:bg-pink-50'
                        }`}
                      >
                        {isHovered ? '🚗 এখনই বুক করুন' : 'প্যাকেজ নির্বাচন করুন'}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="inline-block px-10 py-6 bg-gradient-to-r from-tinder to-red-500 rounded-full shadow-tinder transform hover:scale-105 transition-transform border-2 border-white">
            <p className="text-white font-bold text-xl">
              📞 সরাসরি কল করুন: <a href={`tel:${config.trainingCenter.phone}`} className="underline hover:text-gray-100 decoration-2">{config.trainingCenter.phone}</a>
            </p>
            <p className="text-white/90 text-base mt-1">বিনামূল্যে পরামর্শ পান</p>
          </div>
        </div>
      </div>
    </section>
  );
}

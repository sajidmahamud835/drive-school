'use client';

import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { Package } from '@/types';
import Link from 'next/link';

const packages: Package[] = [
  {
    id: '15-days',
    name: '15 Days Package',
    duration: '15 days',
    price: 0, // Placeholder
    description: 'Perfect for quick learners who want to get on the road fast',
    features: [
      '15 days of intensive training',
      'Flexible scheduling',
      'Road test preparation',
      'Certificate of completion',
    ],
    isActive: true,
  },
  {
    id: '1-month',
    name: '1 Month Package',
    duration: '1 month',
    price: 0, // Placeholder
    description: 'Comprehensive training program for confident driving',
    features: [
      '30 days of structured training',
      'Theory and practical lessons',
      'Highway driving experience',
      'Parking techniques',
      'Road test preparation',
    ],
    isActive: true,
  },
  {
    id: 'pay-as-you-go',
    name: 'Pay As You Go',
    duration: 'Flexible',
    price: 0, // Placeholder
    description: 'For students who want to practice after completing their course',
    features: [
      'Flexible scheduling',
      'Pay per session',
      'Practice specific skills',
      'No long-term commitment',
    ],
    isActive: true,
  },
];

export default function Packages() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Package</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the training package that best fits your schedule and learning goals
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{pkg.name}</CardTitle>
                <p className="text-gray-600 mt-2">{pkg.description}</p>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href={`/booking?package=${pkg.id}`} className="block">
                  <Button variant="primary" className="w-full">
                    Select Package
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

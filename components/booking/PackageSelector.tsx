'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { Package } from '@/types';

interface PackageSelectorProps {
  packages: Package[];
  selectedPackage: Package | null;
  onSelect: (pkg: Package) => void;
  onContinue: () => void;
}

export default function PackageSelector({
  packages,
  selectedPackage,
  onSelect,
  onContinue,
}: PackageSelectorProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900">
        আপনার প্যাকেজ নির্বাচন করুন
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`cursor-pointer transition-all border-2 ${
              selectedPackage?.id === pkg.id
                ? 'ring-4 ring-tinder shadow-tinder border-tinder bg-pink-50'
                : 'border-gray-200 hover:border-tinder hover:shadow-lg bg-white'
            }`}
            onClick={() => onSelect(pkg)}
          >
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 mb-3">{pkg.name}</CardTitle>
              <p className="text-gray-700 text-base font-medium">{pkg.description}</p>
              {pkg.id === 'pay-as-you-go' && pkg.note && (
                <div className="mt-3 px-3 py-1.5 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                  <p className="text-yellow-800 text-xs font-bold">
                    ⚠️ {pkg.note}
                  </p>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {pkg.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-start text-base">
                    <span className="text-green-600 mr-3 text-xl font-bold">✓</span>
                    <span className="text-gray-800 font-medium leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedPackage && (
        <div className="flex justify-center">
          <Button 
            variant="primary" 
            size="lg" 
            onClick={onContinue}
            className="px-12 py-5 bg-tinder hover:bg-red-600 text-white font-bold text-lg rounded-xl shadow-tinder transform hover:scale-105"
          >
            চেকআউটে যান →
          </Button>
        </div>
      )}
    </div>
  );
}

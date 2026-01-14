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
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Select Your Package</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`cursor-pointer transition-all ${
              selectedPackage?.id === pkg.id
                ? 'ring-2 ring-blue-600 shadow-lg'
                : 'hover:shadow-md'
            }`}
            onClick={() => onSelect(pkg)}
          >
            <CardHeader>
              <CardTitle>{pkg.name}</CardTitle>
              <p className="text-gray-600 text-sm mt-2">{pkg.description}</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                {pkg.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedPackage && (
        <div className="flex justify-end">
          <Button variant="primary" size="lg" onClick={onContinue}>
            Continue to Checkout
          </Button>
        </div>
      )}
    </div>
  );
}

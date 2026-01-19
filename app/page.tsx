import type { Metadata } from 'next';
import Hero from '@/components/landing/Hero';
import Packages from '@/components/landing/Packages';
import Testimonials from '@/components/landing/Testimonials';
import Videos from '@/components/landing/Videos';
import Reviews from '@/components/landing/Reviews';
import GoogleMapsEmbed from '@/components/landing/GoogleMapsEmbed';
import Footer from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: "থ্রি স্টার ড্রাইভিং ট্রেনিং সেন্টার | বরিশালের সেরা ড্রাইভিং স্কুল | এখনই বুক করুন",
  description: "বরিশালের #1 ড্রাইভিং ট্রেনিং সেন্টার! ✅ ১৫ দিনে বা ১ মাসে ড্রাইভিং শিখুন ✅ ১৫০+ সফল শিক্ষার্থী ✅ অনুমোদিত প্রশিক্ষক ✅ সহজ পেমেন্ট ✅ সার্টিফিকেট গ্যারান্টি। এখনই বুক করুন এবং ড্রাইভিং শিখুন!",
  keywords: [
    "ড্রাইভিং ট্রেনিং বরিশাল",
    "ড্রাইভিং স্কুল বরিশাল",
    "গাড়ি চালানো শেখা",
    "ড্রাইভিং কোর্স",
    "১৫ দিনে ড্রাইভিং",
    "১ মাসে ড্রাইভিং",
    "থ্রি স্টার ড্রাইভিং",
    "driving school barishal",
    "driving training bangladesh",
    "learner driving course barishal"
  ],
  openGraph: {
    title: "থ্রি স্টার ড্রাইভিং ট্রেনিং সেন্টার | বরিশালের সেরা ড্রাইভিং স্কুল",
    description: "বরিশালের #1 ড্রাইভিং ট্রেনিং সেন্টার! ১৫ দিনে বা ১ মাসে ড্রাইভিং শিখুন। ১৫০+ সফল শিক্ষার্থী। এখনই বুক করুন!",
    url: "/",
    siteName: "থ্রি স্টার ড্রাইভিং ট্রেনিং সেন্টার",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "থ্রি স্টার ড্রাইভিং ট্রেনিং সেন্টার - বরিশালের সেরা ড্রাইভিং স্কুল",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "থ্রি স্টার ড্রাইভিং ট্রেনিং সেন্টার | বরিশালের সেরা ড্রাইভিং স্কুল",
    description: "বরিশালের #1 ড্রাইভিং ট্রেনিং সেন্টার! ১৫ দিনে বা ১ মাসে ড্রাইভিং শিখুন। ১৫০+ সফল শিক্ষার্থী। এখনই বুক করুন!",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <div id="packages">
        <Packages />
      </div>
      <Testimonials />
      <Videos />
      <Reviews />
      <GoogleMapsEmbed />
      <Footer />
    </main>
  );
}

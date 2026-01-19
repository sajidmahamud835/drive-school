import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Noto_Sans_Bengali } from "next/font/google";
import AuthProviderWrapper from "@/components/providers/AuthProviderWrapper";
import PageViewTracker from "@/components/analytics/PageViewTracker";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://3stardriving.alharih.com'),
  title: {
    default: "থ্রি স্টার ড্রাইভিং ট্রেনিং সেন্টার | বরিশালের সেরা ড্রাইভিং স্কুল | এখনই বুক করুন",
    template: "%s | থ্রি স্টার ড্রাইভিং ট্রেনিং সেন্টার"
  },
  description: "বরিশালের #1 ড্রাইভিং ট্রেনিং সেন্টার! ১৫ দিনে বা ১ মাসে ড্রাইভিং শিখুন। ১৫০+ সফল শিক্ষার্থী। ✅ অনুমোদিত প্রশিক্ষক ✅ সহজ পেমেন্ট ✅ সার্টিফিকেট গ্যারান্টি। এখনই বুক করুন!",
  keywords: [
    "ড্রাইভিং ট্রেনিং",
    "ড্রাইভিং স্কুল",
    "বরিশাল ড্রাইভিং",
    "গাড়ি চালানো শেখা",
    "ড্রাইভিং কোর্স",
    "থ্রি স্টার ড্রাইভিং",
    "driving school barishal",
    "driving training bangladesh",
    "learner driving course",
    "car driving lessons"
  ],
  authors: [{ name: "থ্রি স্টার ড্রাইভিং ট্রেনিং সেন্টার" }],
  creator: "থ্রি স্টার ড্রাইভিং ট্রেনিং সেন্টার",
  publisher: "থ্রি স্টার ড্রাইভিং ট্রেনিং সেন্টার",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: "/",
    siteName: "থ্রি স্টার ড্রাইভিং ট্রেনিং সেন্টার",
    title: "থ্রি স্টার ড্রাইভিং ট্রেনিং সেন্টার | বরিশালের সেরা ড্রাইভিং স্কুল",
    description: "বরিশালের #1 ড্রাইভিং ট্রেনিং সেন্টার! ১৫ দিনে বা ১ মাসে ড্রাইভিং শিখুন। ১৫০+ সফল শিক্ষার্থী। এখনই বুক করুন!",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "থ্রি স্টার ড্রাইভিং ট্রেনিং সেন্টার",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "থ্রি স্টার ড্রাইভিং ট্রেনিং সেন্টার | বরিশালের সেরা ড্রাইভিং স্কুল",
    description: "বরিশালের #1 ড্রাইভিং ট্রেনিং সেন্টার! ১৫ দিনে বা ১ মাসে ড্রাইভিং শিখুন। ১৫০+ সফল শিক্ষার্থী। এখনই বুক করুন!",
    images: ["/og-image.jpg"],
    creator: "@threestardriving",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "/",
  },
  category: "Education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const trainingCenterName = process.env.NEXT_PUBLIC_TRAINING_CENTER_NAME || 'থ্রি স্টার ড্রাইভিং ট্রেনিং সেন্টার';
  const trainingCenterAddress = process.env.NEXT_PUBLIC_TRAINING_CENTER_ADDRESS || 'বান্দ রোড, বরিশাল 8200';
  const trainingCenterPhone = process.env.NEXT_PUBLIC_TRAINING_CENTER_PHONE || '+8801707969391';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://3stardriving.alharih.com';

  // Structured Data (JSON-LD) for LocalBusiness
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "DrivingSchool",
    "name": trainingCenterName,
    "image": `${siteUrl}/og-image.jpg`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": trainingCenterAddress,
      "addressLocality": "বরিশাল",
      "addressRegion": "বরিশাল",
      "postalCode": "8200",
      "addressCountry": "BD"
    },
    "telephone": trainingCenterPhone,
    "priceRange": "৳5,500 - ৳8,000",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday", "Sunday"],
        "opens": "07:00",
        "closes": "12:00"
      }
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150"
    },
    "description": "বরিশালের #1 ড্রাইভিং ট্রেনিং সেন্টার। ১৫ দিনে বা ১ মাসে ড্রাইভিং শিখুন। ১৫০+ সফল শিক্ষার্থী।",
    "url": siteUrl,
    "sameAs": [
      process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://www.facebook.com/profile.php?id=61557557160429"
    ]
  };

  return (
    <html lang="bn">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PZLZB6CX');`,
          }}
        />
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansBengali.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PZLZB6CX"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <AuthProviderWrapper>
          <PageViewTracker />
          {children}
        </AuthProviderWrapper>
      </body>
    </html>
  );
}

'use client';

export default function Reviews() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-3 bg-tinder/10 rounded-full mb-6 border-2 border-tinder/20">
            <span className="text-tinder font-bold text-lg">⭐ রিভিউ</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
            <span className="block">১৫০+ শিক্ষার্থীর</span>
            <span className="block text-tinder">বিশ্বাস</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed mb-8">
            Google Maps এ আমাদের শিক্ষার্থীরা কী বলছেন দেখুন
          </p>
          
          {/* Rating Display */}
          <div className="flex items-center justify-center gap-4 mb-10 bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg border-2 border-yellow-200 max-w-md mx-auto">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-12 h-12 fill-current animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <div>
              <span className="text-5xl font-bold text-gray-900 block">৫.০</span>
              <span className="text-gray-600 text-lg font-medium">১৫০+ রিভিউ</span>
            </div>
          </div>
          
          <a
            href="https://www.google.com/maps/place/থ্রি+স্টার+ড্রাইভিং+ট্রেনিং+সেন্টার/@22.6888278,90.3648536,17z/data=!3m1!4b1!4m6!3m5!1s0x37553592540275d5:0x8ff9f400f2f49933!8m2!3d22.6888278!4d90.3670285!16s%2Fg%2F11v0q8vq1h?entry=ttu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-tinder text-white font-bold text-lg rounded-full hover:bg-red-600 transition-colors shadow-tinder transform hover:scale-105"
          >
            <span>Google Maps এ সব রিভিউ দেখুন</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
        
        {/* Review Cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              name: 'আহমেদ', 
              initial: 'A', 
              review: 'চমৎকার ড্রাইভিং স্কুল! প্রশিক্ষকরা ধৈর্যশীল এবং পেশাদার। আমি প্রথমবারেই পাস করেছি!' 
            },
            { 
              name: 'ফাতিমা', 
              initial: 'F', 
              review: 'অসাধারণ অভিজ্ঞতা! আমি আত্মবিশ্বাসের সাথে গাড়ি চালানো শিখেছি। সুপারিশ করছি!' 
            },
            { 
              name: 'করিম', 
              initial: 'K', 
              review: 'শিক্ষকরা খুব সহায়ক এবং বুঝিয়ে দেন। পার্কিং থেকে হাইওয়ে সবকিছুই শিখেছি।' 
            },
          ].map((review, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl shadow-xl border-2 border-gray-100 hover:border-tinder transition-all transform hover:scale-105"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-tinder rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {review.initial}
                </div>
                <div>
                  <p className="font-bold text-xl text-gray-900">{review.name}</p>
                  <div className="flex text-yellow-400 mt-2">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-800 leading-relaxed text-lg font-medium italic">
                "{review.review}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

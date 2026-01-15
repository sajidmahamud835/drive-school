'use client';

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: 'শিক্ষার্থী সাক্ষাৎকার ১',
      videoUrl: '/videos/testimonial-1.mp4',
    },
    {
      id: 2,
      name: 'শিক্ষার্থী সাক্ষাৎকার ২',
      videoUrl: '/videos/testimonial-2.mp4',
    },
    {
      id: 3,
      name: 'শিক্ষার্থী সাক্ষাৎকার ৩',
      videoUrl: '/videos/testimonial-3.mp4',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block px-6 py-3 bg-tinder/10 rounded-full mb-6 border-2 border-tinder/20">
            <span className="text-tinder font-bold text-lg">🎥 সাক্ষাৎকার</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 leading-tight">
            <span className="block">আমাদের শিক্ষার্থীরা</span>
            <span className="block text-tinder">কী বলছেন</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto font-medium leading-relaxed">
            আমাদের ড্রাইভিং স্কুলের স্নাতকদের বাস্তব অভিজ্ঞতা
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-50 rounded-2xl overflow-hidden border-2 border-gray-200 hover:border-tinder transition-all transform hover:scale-105 shadow-lg">
              <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative group">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                    <svg className="w-12 h-12 text-tinder ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-600 font-medium text-lg">ভিডিও প্লেসহোল্ডার</p>
              </div>
              <div className="p-6">
                <p className="font-bold text-xl text-gray-900">{testimonial.name}</p>
                <p className="text-gray-600 mt-2 text-base">শিক্ষার্থীর সাক্ষাৎকার</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

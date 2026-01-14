'use client';

export default function Reviews() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by 150+ Students</h2>
          <p className="text-lg text-gray-600 mb-8">
            See what our students are saying on Google Maps
          </p>
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-2xl font-bold text-gray-900">5.0</span>
            <span className="text-gray-600">(150+ reviews)</span>
          </div>
          <a
            href="https://maps.google.com" // Replace with actual Google Maps link
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            View All Reviews on Google Maps
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sample review cards - replace with actual Google Reviews API integration */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {String.fromCharCode(64 + i)}
                </div>
                <div>
                  <p className="font-semibold">Student {i}</p>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-700">
                "Excellent driving school! The instructors are patient and professional. I passed my test on the first try!"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

export default function Testimonials() {
  // Placeholder for testimonial videos
  const testimonials = [
    {
      id: 1,
      name: 'Student Testimonial 1',
      videoUrl: '/videos/testimonial-1.mp4', // Placeholder
    },
    {
      id: 2,
      name: 'Student Testimonial 2',
      videoUrl: '/videos/testimonial-2.mp4', // Placeholder
    },
    {
      id: 3,
      name: 'Student Testimonial 3',
      videoUrl: '/videos/testimonial-3.mp4', // Placeholder
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Students Say</h2>
          <p className="text-lg text-gray-600">
            Real experiences from our driving school graduates
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-gray-100 rounded-lg overflow-hidden">
              <div className="aspect-video bg-gray-300 flex items-center justify-center">
                <p className="text-gray-500">Video Placeholder</p>
                {/* Replace with actual video element when videos are available */}
                {/* <video controls className="w-full h-full object-cover">
                  <source src={testimonial.videoUrl} type="video/mp4" />
                </video> */}
              </div>
              <div className="p-4">
                <p className="font-semibold">{testimonial.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

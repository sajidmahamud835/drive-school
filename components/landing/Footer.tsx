import { config } from '@/lib/config';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-3xl font-bold mb-6 gradient-tinder bg-clip-text text-transparent">
              {config.trainingCenter.name}
            </h3>
            <p className="text-gray-400 leading-relaxed text-lg">
              পেশাদার ড্রাইভিং প্রশিক্ষণ কেন্দ্র যা শিক্ষার্থীদের আত্মবিশ্বাসের সাথে রাস্তায় আয়ত্ত করতে সাহায্য করে
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-xl">দ্রুত লিঙ্ক</h4>
            <ul className="space-y-3 text-gray-400 text-lg">
              <li>
                <a href="/" className="hover:text-white transition-colors font-medium">
                  হোম
                </a>
              </li>
              <li>
                <a href="/booking" className="hover:text-white transition-colors font-medium">
                  বুক করুন
                </a>
              </li>
              <li>
                <a href="#packages" className="hover:text-white transition-colors font-medium">
                  প্যাকেজ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-xl">যোগাযোগ</h4>
            <ul className="space-y-4 text-gray-400 text-lg">
              <li className="flex items-start gap-3">
                <span className="text-tinder text-2xl">📧</span>
                <a href={`mailto:${config.trainingCenter.email}`} className="hover:text-white transition-colors font-medium">
                  {config.trainingCenter.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-tinder text-2xl">📞</span>
                <a href={`tel:${config.trainingCenter.phone}`} className="hover:text-white transition-colors font-medium">
                  {config.trainingCenter.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-tinder text-2xl">📍</span>
                <span className="font-medium">{config.trainingCenter.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-tinder text-2xl">🕐</span>
                <span className="font-medium">সোম-বৃহ: সকাল ৭টা - ১২টা</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-tinder text-2xl">📘</span>
                <a 
                  href={config.trainingCenter.facebookUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors font-medium"
                >
                  Facebook পেজ
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-lg">
          <p>&copy; {new Date().getFullYear()} {config.trainingCenter.name}. সর্বস্বত্ব সংরক্ষিত</p>
        </div>
      </div>
    </footer>
  );
}

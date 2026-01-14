export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Drive School</h3>
            <p className="text-gray-400">
              Professional driving training center helping students master the road with confidence.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/booking" className="hover:text-white transition-colors">
                  Book a Lesson
                </a>
              </li>
              <li>
                <a href="#packages" className="hover:text-white transition-colors">
                  Packages
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@driveschool.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Hours: Mon-Thu 7:00 AM - 12:00 PM</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Drive School. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

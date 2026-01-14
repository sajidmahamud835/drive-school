import Hero from '@/components/landing/Hero';
import Packages from '@/components/landing/Packages';
import Testimonials from '@/components/landing/Testimonials';
import Videos from '@/components/landing/Videos';
import Reviews from '@/components/landing/Reviews';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <div id="packages">
        <Packages />
      </div>
      <Testimonials />
      <Videos />
      <Reviews />
      <Footer />
    </main>
  );
}

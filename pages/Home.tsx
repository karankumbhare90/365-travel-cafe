import { AboutExperienceSection } from '@/components/About';
import { GallerySection } from '@/components/Gallery';
import { Hero } from '@/components/Hero';
import { MenuHighlights } from '@/components/MenuHighlights';
import { NewsletterSection } from '@/components/Newsletter';
import { Testimonials } from '@/components/Testimonial';
import { supabase } from '@/lib/supabase';
import React from 'react';
import { FaBookOpen, FaHeart, FaQuoteLeft, FaRegCalendar, FaStar, FaWifi } from 'react-icons/fa';
import { IoIosArrowDown, IoMdArrowForward } from 'react-icons/io';
import { IoPeopleSharp } from 'react-icons/io5';
import { MdOutlineFlightTakeoff, MdPets } from 'react-icons/md';
import { Link } from 'react-router-dom';


const instaPosts = [
   'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=2670&auto=format&fit=crop',
   'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2670&auto=format&fit=crop',
   'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2670&auto=format&fit=crop',
   'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=2574&auto=format&fit=crop'
];

const Home: React.FC = () => {
   return (
      <>
         {/* 1. HERO SECTION */}
         <Hero/>

         {/* 2. ABOUT TEASER */}
         <AboutExperienceSection/>

         {/* 3. MENU HIGHLIGHTS */}
         <MenuHighlights/>

         {/* 4. VISUAL GALLERY */}
         <GallerySection />

         {/* 5. TESTIMONIALS */}
         <Testimonials/>

         {/* 6. NEWSLETTER CTA */}
         <NewsletterSection />

         {/* 7. INSTAGRAM */}
         <section className="bg-surface-dark py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
                  <div>
                     <h2 className="text-3xl font-bold text-white mb-2">@TravelCafeSurat</h2>
                     <p className="text-gray-400">Join our community of 50k+ travelers. Tag us to get featured on our boarding board.</p>
                  </div>
                  <a href="#" className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all">
                     <span className="font-bold text-lg leading-none">IG</span>
                     Follow Us
                  </a>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {instaPosts.map((src, i) => (
                     <div key={i} className="aspect-square relative group cursor-pointer rounded-lg overflow-hidden">
                        <img src={src} alt="Instagram Post" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                           <span className="react-icons-round text-white text-3xl"><FaHeart/></span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>
      </>
   );
};

export default Home;
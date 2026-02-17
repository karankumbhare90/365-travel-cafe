import React from 'react';
import { MdLocalAirport, MdOutlineMenuBook } from 'react-icons/md';

const Story: React.FC = () => {
  return (
    <div className="bg-background-dark">
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span>Surat's Passport to the World</span>
              </div>
              <h1 className="font-serif text-5xl lg:text-7xl font-bold leading-tight text-white">
                A Journey of <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200 italic pr-2">Flavor & Wanderlust</span>
              </h1>
              <p className="text-lg text-gray-400 max-w-lg leading-relaxed border-l-2 border-primary/30 pl-6">
                Welcome to 365 The Travel Cafe. Where every corner tells a story, and every dish is a souvenir from a distant land. Fasten your seatbelts; we are about to take off.
              </p>
              
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-4">
                   <div className="w-12 h-12 rounded-full border-2 border-background-dark bg-gray-600"></div>
                   <div className="w-12 h-12 rounded-full border-2 border-background-dark bg-gray-500"></div>
                   <div className="w-12 h-12 rounded-full border-2 border-background-dark bg-surface-dark flex items-center justify-center text-xs font-bold text-primary">
                      Est.<br/>2021
                   </div>
                </div>
                <span className="text-sm font-medium text-gray-400">Crafted by passionate travelers</span>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-primary rounded-xl transform rotate-3 translate-x-2 translate-y-2 opacity-20 group-hover:rotate-6 transition-transform duration-500"></div>
              <div className="relative rounded-xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img 
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2694&auto=format&fit=crop" 
                  alt="Cafe Interior" 
                  className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="font-serif text-2xl italic">"The world in a cup."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Inspiration Section */}
      <section className="py-20 lg:py-32 bg-surface-dark relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
               {/* Image Side */}
               <div className="order-2 lg:order-1 relative">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-4 mt-8">
                        <img src="https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?q=80&w=2664&auto=format&fit=crop" className="w-full h-64 object-cover rounded-lg shadow-lg" alt="Map" />
                        <div className="p-6 bg-surface-darker rounded-lg border border-white/5">
                           <h3 className="text-primary font-bold text-lg mb-2">30+ Countries</h3>
                           <p className="text-gray-400 text-sm">Explored by our founders to bring authentic tastes back home.</p>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <div className="p-6 bg-primary rounded-lg text-background-dark">
                           <span className="react-icons text-4xl mb-2"><MdLocalAirport/> </span>
                           <h3 className="font-bold text-lg">Boarding Pass</h3>
                           <p className="text-background-dark/70 text-sm font-medium">Next stop: Deliciousness.</p>
                        </div>
                        <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2670&auto=format&fit=crop" className="w-full h-64 object-cover rounded-lg shadow-lg" alt="Window" />
                     </div>
                  </div>
               </div>
               
               {/* Text Side */}
               <div className="order-1 lg:order-2">
                  <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">The Inspiration</span>
                  <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-8 text-white">More Than Just a Cafe.<br/>It's a <span className="italic text-primary">Destination.</span></h2>
                  <div className="prose prose-lg prose-invert text-gray-400 font-light">
                     <p className="mb-6">
                        The idea for '365' was born somewhere between a bustling street market in Bangkok and a quiet bistro in Paris. We realized that travel isn't just about moving from place to place—it's about the flavors, the aromas, and the stories shared over a meal.
                     </p>
                     <p className="mb-8">
                        We wanted to bring that sense of wonder to Surat. A place where you don't need a visa to experience the world. Every artifact on our walls, every recipe in our kitchen, has been handpicked from our personal journeys.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Mission */}
      <section className="py-24 relative bg-background-dark border-y border-white/5">
         <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
            <span className="react-icons text-primary text-5xl mb-6"><MdOutlineMenuBook/></span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-8 text-white">
                "Our mission is to bridge cultures through cuisine, serving <span className="text-primary underline decoration-2 underline-offset-4 decoration-primary/50">global comfort food</span> with the warmth of Indian hospitality."
            </h2>
            <div className="flex justify-center gap-4 flex-wrap">
               <span className="px-4 py-1 rounded-full border border-white/10 text-xs font-medium text-gray-400 bg-surface-dark uppercase tracking-wide">Authentic Recipes</span>
               <span className="px-4 py-1 rounded-full border border-white/10 text-xs font-medium text-gray-400 bg-surface-dark uppercase tracking-wide">Fresh Ingredients</span>
               <span className="px-4 py-1 rounded-full border border-white/10 text-xs font-medium text-gray-400 bg-surface-dark uppercase tracking-wide">Curated Ambience</span>
            </div>
         </div>
      </section>
    </div>
  );
};

export default Story;
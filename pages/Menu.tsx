import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { BiGridSmall } from 'react-icons/bi';
import { FiSearch } from 'react-icons/fi';
import { MdFlight, MdFlightTakeoff, MdOutlineMenuBook, MdOutlineTimer } from 'react-icons/md';
import { RiRestaurantFill } from 'react-icons/ri';
import { FaRegCompass } from 'react-icons/fa';
import { FaArrowTrendUp } from 'react-icons/fa6';

// Defining interface for type safety
interface MenuItem {
   id: string;
   title: string;
   description: string;
   price: number;
   time_estimate: string;
   category: string;
   image_url: string;
   is_veg: boolean;
   is_spicy: boolean;
   is_bestseller: boolean;
}

const VegIcon = () => (
   <div className="border-2 border-green-600 p-[1px] w-[18px] h-[18px] flex items-center justify-center" title="Veg">
      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
   </div>
);

const NonVegIcon = () => (
   <div className="border-2 border-red-600 p-[1px] w-[18px] h-[18px] flex items-center justify-center" title="Non-Veg">
      <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-red-600"></div>
   </div>
);

const Menu: React.FC = () => {
   const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
   const [loading, setLoading] = useState(true);
   const [filter, setFilter] = useState('All');
   const [activeCategory, setActiveCategory] = useState<string | null>(null);

   useEffect(() => {
      const fetchMenu = async () => {
         const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .order('category', { ascending: true });

         if (error) {
            console.error('Error fetching menu:', error);
         } else if (data) {
            setMenuItems(data);
         }
         setLoading(false);
      };

      fetchMenu();
   }, []);

   const filteredItems = menuItems.filter(item => {
      if (activeCategory && item.category !== activeCategory) return false;
      if (filter === 'Veg' && !item.is_veg) return false;
      if (filter === 'Spicy' && !item.is_spicy) return false;
      return true;
   });

   // Extract unique categories for sidebar
   const categories = Array.from(new Set(menuItems.map(item => item.category)));

   if (loading) {
      return (
         <div className="min-h-screen bg-background-dark flex items-center justify-center text-primary">
            <div className="text-center flex items-center justify-center flex-col gap-4">
               <span className="react-icons animate-spin text-4xl"><MdFlight/></span>
               <p>Loading Menu...</p>
            </div>
         </div>
      );
   }

   return (
      <div className="flex flex-col md:flex-row min-h-screen bg-background-light dark:bg-background-dark">
         {/* Sidebar */}
         <aside className="w-full md:w-72 md:h-screen md:sticky md:top-20 bg-surface-darker border-r border-white/5 flex flex-col z-40 shadow-xl">
            <div className="p-6">
               <div className="flex items-center gap-3 mb-6">
                  <span className="react-icons-round text-primary text-4xl"><MdFlightTakeoff/></span>
                  <div>
                     <h1 className="text-2xl font-bold tracking-tight text-white leading-none">365</h1>
                     <p className="text-xs text-primary uppercase tracking-widest font-semibold">The Travel Cafe</p>
                  </div>
               </div>
               <div className="relative">
                  <input type="text" placeholder="Search menu..." className="w-full bg-white/5 border-none rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary placeholder-gray-500 text-white" />
                  <span className="react-icons absolute left-3 top-3 text-gray-400 text-lg"><FiSearch/></span>
               </div>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 pb-8 space-y-1">
               <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-2">Passport Menu</div>

               <button
                  onClick={() => setActiveCategory(null)}
                  className={`w-full group flex items-center gap-4 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${!activeCategory ? 'bg-primary/20 text-primary' : 'text-gray-300 hover:bg-white/5 hover:text-primary'}`}
               >
                  <span className="react-icons text-lg">
                     <BiGridSmall />
                  </span>
                  <span>All Items</span>
               </button>

               {categories.map((cat, idx) => (
                  <button
                     key={idx}
                     onClick={() => setActiveCategory(cat)}
                     className={`w-full group flex items-center gap-4 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${activeCategory === cat ? 'bg-primary/20 text-primary' : 'text-gray-300 hover:bg-white/5 hover:text-primary'}`}
                  >
                     <span className="react-icons text-lg"><RiRestaurantFill/></span>
                     <span>{cat}</span>
                  </button>
               ))}

               <div className="mt-8 px-4 py-6 bg-primary/10 rounded-xl border border-primary/20">
                  <h4 className="font-bold text-primary mb-1">Today's Destination</h4>
                  <p className="text-sm text-gray-400 mb-3">Experience the flavors of Italy with our Chef's Special.</p>
                  <button className="text-xs font-bold uppercase tracking-wider text-white bg-white/10 hover:bg-primary hover:text-black py-2 px-4 rounded-lg w-full transition-colors">View Specials</button>
               </div>
            </nav>
         </aside>

         {/* Main Content */}
         <div className="flex-1 min-w-0 bg-background-dark relative">
            <div className="h-64 relative w-full overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent z-10"></div>
               <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2574&auto=format&fit=crop" className="w-full h-full object-cover opacity-60" alt="Header" />
               <div className="absolute bottom-0 left-0 p-8 z-20">
                  <div className="flex items-center gap-2 text-primary mb-2">
                     <span className="react-icons text-sm"><FaRegCompass/></span>
                     <span className="text-xs font-bold uppercase tracking-widest">Culinary Journey</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">{activeCategory || "Global Menu"}</h2>
                  <p className="text-gray-300 max-w-2xl">Begin your journey with our curated selection of global dishes, perfect for sharing before your main flight.</p>
               </div>
            </div>

            {/* Filters */}
            <div className="sticky top-20 z-30 bg-background-dark/95 backdrop-blur-md border-b border-white/5 px-8 py-4 flex items-center gap-4 overflow-x-auto hide-scrollbar">
               <button
                  onClick={() => setFilter('All')}
                  className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${filter === 'All' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'bg-surface-dark border border-white/10 text-gray-300'}`}
               >
                  <span className="react-icons text-lg">
                     <BiGridSmall />
                  </span> All
               </button>
               <button
                  onClick={() => setFilter(filter === 'Veg' ? 'All' : 'Veg')}
                  className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${filter === 'Veg' ? 'bg-primary text-black' : 'bg-surface-dark border border-white/10 text-gray-300'}`}
               >
                  <VegIcon /> Pure Veg
               </button>
               <button
                  onClick={() => setFilter(filter === 'Spicy' ? 'All' : 'Spicy')}
                  className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${filter === 'Spicy' ? 'bg-primary text-black' : 'bg-surface-dark border border-white/10 text-gray-300'}`}
               >
                  <span className="react-icons text-lg text-red-500"><FaArrowTrendUp/></span> Spicy
               </button>
            </div>

            {/* Menu Grid */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
               {filteredItems.length === 0 ? (
                  <div className="col-span-full text-center py-20 text-gray-500 text-center flex flex-col items-center justify-center">
                     <span className="react-icons text-4xl mb-2 text-center"><MdOutlineMenuBook/></span>
                     <p>No items found for this selection.</p>
                  </div>
               ) : filteredItems.map((item) => (
                  <div key={item.id} className="group bg-surface-dark rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5 flex flex-col h-full">
                     <div className="relative h-56 overflow-hidden">
                        <img src={item.image_url || 'https://via.placeholder.com/400'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                        {item.is_bestseller && (
                           <div className="absolute top-4 left-4 bg-red-600/90 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Bestseller</div>
                        )}
                     </div>
                     <div className="p-5 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                           <div className="flex items-center gap-2">
                              {item.is_veg ? <VegIcon /> : <NonVegIcon />}
                              <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">{item.title}</h3>
                           </div>
                           <span className="font-bold text-primary">₹{item.price}</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                           <div className="flex items-center gap-1 text-xs text-gray-400">
                              <span className="react-icons text-sm"><MdOutlineTimer/></span> {item.time_estimate}
                           </div>
                           {item.is_spicy && (
                              <div className="flex items-center gap-1 text-xs text-red-400">
                                 <span className="react-icons text-sm"><FaArrowTrendUp/></span> Spicy
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export default Menu;
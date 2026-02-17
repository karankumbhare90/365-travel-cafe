import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { IoMdArrowForward } from "react-icons/io";

interface MenuItem {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_best: boolean;
}

export const MenuHighlights = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .limit(3); // show 3 items like before

    if (error) {
      setError("Failed to load menu items");
    } else {
      setItems(data || []);
    }

    setLoading(false);
  };

  return (
    <section className="py-20 bg-surface-dark border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">
              In-Flight Menu
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-serif">
              Captain's Recommendations
            </h2>
          </div>

          <Link
            to="/menu"
            className="hidden md:flex items-center gap-2 px-6 py-2 rounded-full border border-white/20 text-white hover:bg-white hover:text-background-dark transition-all font-bold text-sm"
          >
            View Full Menu
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center text-gray-400">
            Loading menu...
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center text-red-500">
            {error}
          </div>
        )}

        {/* Menu Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative bg-background-dark rounded-xl overflow-hidden shadow-lg border border-white/5 hover:border-primary/50 transition-all"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-bold text-white">
                      {item.title}
                    </h3>

                    <span className="text-primary font-bold">
                      ₹{item.price}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mb-4">
                    {item.description}
                  </p>

                  <button className="text-sm font-bold text-white hover:text-primary uppercase tracking-wider flex items-center gap-1">
                    Order Now
                    <span className="text-sm">
                    <IoMdArrowForward />
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mobile Button */}
        <div className="mt-8 text-center md:hidden">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-background-dark font-bold text-sm"
          >
            View Full Menu
          </Link>
        </div>

      </div>
    </section>
  );
};
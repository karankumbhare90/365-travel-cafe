import React, { useState, useMemo, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { supabase } from "@/lib/supabase";

interface GalleryItem {
  id: string;
  type: string;
  title: string;
  img: string;
  height: string;
}


const HEIGHT_CLASSES = ["h-64", "h-72", "h-80", "h-96"];

export const GallerySection: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All Moments");
  const [visibleCount, setVisibleCount] = useState(6);

  const dynamicFilters = useMemo(() => {
    const labels = items.map((item) => item.type);
    const uniqueLabels = Array.from(new Set(labels));
    return ["All Moments", ...uniqueLabels];
  }, [items]);

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      // Map DB → Component format
      const formatted = data.map((item, index) => ({
        id: item.id,
        type: item.label,
        title: item.title,
        img: item.image_url,
        height: HEIGHT_CLASSES[index % HEIGHT_CLASSES.length],
      }));

      setItems(formatted);
    }

    setLoading(false);
  };

  /* ================= FILTER ================= */

  const filteredItems = useMemo(() => {
    if (activeFilter === "All Moments") return items;
    return items.filter((item) => item.type === activeFilter);
  }, [activeFilter, items]);

  const visibleItems = filteredItems.slice(0, visibleCount);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  /* ================= RENDER ================= */

  return (
    <section className="py-20 bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">
          Travel Diaries
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-white font-serif mb-8">
          Captured Moments
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 overflow-x-auto pb-4 hide-scrollbar">
          {dynamicFilters?.map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter);
                setVisibleCount(6);
              }}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all border border-transparent ${
                activeFilter === filter
                  ? "bg-primary text-background-dark shadow-[0_0_15px_rgba(242,208,13,0.3)]"
                  : "bg-surface-dark text-gray-400 hover:text-primary hover:bg-white/5 hover:border-primary/30"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Loading State */}
        {loading && (
          <div className="text-center text-gray-400 py-20">
            Loading gallery...
          </div>
        )}

        {/* Empty State */}
        {!loading && items.length === 0 && (
          <div className="text-center text-gray-500 py-20">
            No gallery items available.
          </div>
        )}

        {/* Gallery Grid */}
        {!loading && items.length > 0 && (
          <>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {visibleItems.map((item) => (
                <div
                  key={item.id}
                  className="break-inside-avoid group relative overflow-hidden rounded-xl bg-surface-dark"
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    loading="lazy"
                    className={`w-full object-cover transform transition-transform duration-700 group-hover:scale-110 ${item.height}`}
                  />

                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary transition-colors duration-300 rounded-xl pointer-events-none z-10"></div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span className="text-primary text-xs font-bold uppercase tracking-wider mb-1">
                      {item.type}
                    </span>
                    <h3 className="text-white font-semibold text-lg">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {visibleCount < filteredItems.length && (
              <div className="flex justify-center mt-12">
                <button
                  onClick={handleLoadMore}
                  className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors text-sm font-medium"
                >
                  <IoIosArrowDown />
                  Load More Moments
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
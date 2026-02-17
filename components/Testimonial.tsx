// components/home/Testimonials.tsx

import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { FaQuoteLeft, FaStar } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  avatar_url?: string | null;
}

export const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const swiperRef = useRef<any>(null);
  const [isBeginning, setIsBeginning] = useState(true);
const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (data) setTestimonials(data);
  };

  if (!testimonials.length) return null;

  return (
    <section className="py-20 bg-surface-dark relative">
      <div className="max-w-7xl mx-auto px-4 relative">

        {/* Heading */}
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="text-primary text-4xl mb-4">
            <FaQuoteLeft />
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white font-serif">
            Traveler Logs
          </h2>
        </div>

        {/* Custom Navigation Buttons */}
        <div className="absolute right-4 bottom-0 flex gap-3 z-10">

        <button
        onClick={() => swiperRef.current?.slidePrev()}
        area-label="Prev Button"
        disabled={isBeginning}
        className={`w-10 h-10 flex items-center justify-center rounded-full
            border border-white/10 transition-all duration-300 shadow-md
            ${isBeginning
            ? "bg-background-dark text-gray-500 cursor-not-allowed opacity-50"
            : "bg-background-dark text-white hover:bg-primary hover:text-black hover:shadow-[0_0_15px_rgba(242,208,13,0.4)]"
            }`}
        >
        <IoIosArrowBack />
        </button>

        <button
        onClick={() => swiperRef.current?.slideNext()}
        area-label="Next Button"
        disabled={isEnd}
        className={`w-10 h-10 flex items-center justify-center rounded-full
            border border-white/10 transition-all duration-300 shadow-md
            ${isEnd
            ? "bg-background-dark text-gray-500 cursor-not-allowed opacity-50"
            : "bg-background-dark text-white hover:bg-primary hover:text-black hover:shadow-[0_0_15px_rgba(242,208,13,0.4)]"
            }`}
        >
        <IoIosArrowForward />
        </button>

        </div>

        <Swiper
            modules={[Pagination]}
            onSwiper={(swiper) => {
                swiperRef.current = swiper;
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
            }}
            onSlideChange={(swiper) => {
                setIsBeginning(swiper.isBeginning);
                setIsEnd(swiper.isEnd);
            }}
            pagination={{ clickable: true }}
            spaceBetween={30}
            loop={false}
            breakpoints={{
                360: { slidesPerView: 1.2 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
            }}
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.id}>
              <div className="bg-background-dark p-6 rounded-xl h-full">

                {/* Rating */}
                <div className="flex gap-1 text-primary mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                      <span  key={i} className="text-sm">
                    <FaStar />

                    </span>
                  ))}
                </div>

                <p className="text-gray-300 italic mb-6">
                  "{t.quote}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                    {t.avatar_url ? (
                      <img
                        src={t.avatar_url}
                        alt={t.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      t.name.charAt(0)
                    )}
                  </div>

                  <div>
                    <p className="text-white font-bold text-sm">
                      {t.name}
                    </p>
                    <span className="text-gray-500 text-xs">
                      {t.role}
                    </span>
                  </div>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
};
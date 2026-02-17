// components/home/Hero.tsx

import { Link } from "react-router-dom";
import { HERO_DATA } from "@/data/homeData";
import { MdOutlineFlightTakeoff } from "react-icons/md";
import { FaBookOpen, FaRegCalendar } from "react-icons/fa";

export const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
      <img
        src={HERO_DATA.background}
        alt="Cafe Hero"
        className="w-full h-full object-cover"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        width="1920"
        height="1080"
      />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background-dark" />
      </div>

      <div className="relative z-10 text-center max-w-4xl px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md mb-6">
          <span className="react-icons text-primary text-sm">
            <MdOutlineFlightTakeoff />
          </span>
          <span className="text-white text-sm font-semibold tracking-widest uppercase">
            {HERO_DATA.badge}
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-white font-serif mb-6">
          {HERO_DATA.title}
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-yellow-200">
            {HERO_DATA.highlight}
          </span>
        </h1>

        <p className="text-gray-200 text-lg md:text-xl mb-10">
          {HERO_DATA.description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/reserve"
            className="px-8 py-4 bg-primary text-background-dark rounded-full font-bold text-lg hover:bg-white transition-all shadow-[0_0_20px_rgba(242,208,13,0.4)] flex items-center justify-center gap-2"
          >
            <span className="react-icons">
              <FaRegCalendar />
            </span>
            Book Your Seat
          </Link>
          <Link
            to="/menu"
            className="px-8 py-4 bg-white/10 backdrop-blur border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
          >
            <span className="react-icons">
              <FaBookOpen />
            </span>
            View Menu
          </Link>
        </div>
      </div>
    </section>
  );
};

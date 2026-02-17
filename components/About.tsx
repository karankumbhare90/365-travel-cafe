import React from "react";
import { Link } from "react-router-dom";
import { IoMdArrowForward } from "react-icons/io";
import { IoPeopleSharp } from "react-icons/io5";
import { FaWifi } from "react-icons/fa";
import { MdPets } from "react-icons/md";

interface FeatureItem {
  icon: React.ElementType;
  text: string;
}

interface AboutExperienceSectionProps {
  badge?: string;
  title?: string;
  description?: string;
  image?: string;
  quote?: string;
  quoteSubtext?: string;
  features?: FeatureItem[];
  ctaText?: string;
  ctaLink?: string;
  backgroundNumber?: string;
}

export const AboutExperienceSection: React.FC<AboutExperienceSectionProps> = ({
  badge = "The Experience",
  title = "More Than Just Coffee. \nIt's an Adventure.",
  description = "At 365, every detail is a souvenir. From our boarding pass menus to the vintage suitcases adorning the walls, we've recreated the thrill of travel. Whether you're craving authentic Italian pasta or spicy Asian street food, your table is your destination.",
  image = "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?q=80&w=2670&auto=format&fit=crop",
  quote = "A passport to flavor.",
  quoteSubtext = "Curated by our founders from their travels across 30+ countries.",
  features = [
    {
      icon: IoPeopleSharp,
      text: "Global Cuisine from 5 Continents",
    },
    {
      icon: FaWifi,
      text: "Cozy Workspace & High-Speed WiFi",
    },
    {
      icon: MdPets,
      text: "Pet Friendly Outdoor Seating",
    },
  ],
  ctaText = "Read Our Full Story",
  ctaLink = "/story",
  backgroundNumber = "365",
}) => {
  return (
    <section className="py-20 bg-background-dark relative overflow-hidden">
      {/* Decorative Background Number */}
      <div className="absolute top-20 left-10 text-[10rem] font-bold text-white/5 font-serif pointer-events-none select-none leading-none">
        {backgroundNumber}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Image Section */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>

            <picture>
              {/* AVIF (best compression) */}
              <source
                srcSet={`${image}?format=avif&width=600`}
                type="image/avif"
              />

              {/* WebP fallback */}
              <source
                srcSet={`${image}?format=webp&width=600`}
                type="image/webp"
              />

              {/* Default fallback */}
              <img
                src={`${image}?width=600`}
                alt="About Section"
                loading="lazy"
                decoding="async"
                width="600"
                height="500"
                className="rounded-2xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 w-full object-cover h-[500px]"
              />
            </picture>

            <div className="absolute -bottom-6 -right-6 bg-surface-darker p-6 rounded-xl border border-white/10 shadow-xl max-w-xs">
              <p className="text-primary font-serif italic text-lg mb-2">
                "{quote}"
              </p>
              <p className="text-gray-400 text-xs">{quoteSubtext}</p>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            <span className="text-primary font-bold tracking-widest uppercase text-sm">
              {badge}
            </span>

            <h2 className="text-4xl font-bold text-white font-serif whitespace-pre-line">
              {title}
            </h2>

            <p className="text-gray-400 text-lg leading-relaxed">
              {description}
            </p>

            {/* Feature List */}
            <ul className="space-y-3 pt-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-gray-300"
                  >
                    <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm">
                      <Icon />
                    </span>
                    <span>{feature.text}</span>
                  </li>
                );
              })}
            </ul>

            {/* CTA */}
            <div className="pt-6">
              <Link
                to={ctaLink}
                className="text-primary font-bold hover:text-white transition-colors flex items-center gap-2 group"
              >
                {ctaText}
                <span className="group-hover:translate-x-1 transition-transform">
                  <IoMdArrowForward />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

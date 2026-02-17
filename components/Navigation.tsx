import React, { useState } from "react";
import { FaRegCalendar } from "react-icons/fa";
import { HiOutlineBars3BottomRight } from "react-icons/hi2";
import { IoCloseSharp } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";

const NAVBAR_CONFIG = {
  logo: {
    letter: "T",
    title: "TRAVEL",
    highlight: "CAFE",
    tagline: "Est. 2023",
  },

  links: [
    { label: "Home", path: "/" },
    { label: "Our Story", path: "/story" },
    { label: "Menu", path: "/menu" },
    { label: "Events", path: "/events" },
    { label: "Contact", path: "/contact" },
  ],

  cta: {
    label: "Book a Table",
    path: "/reserve",
    icon: FaRegCalendar,
  },
};

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors hover:text-primary ${
      isActive ? "text-primary" : "text-gray-300"
    }`;

  const CTAIcon = NAVBAR_CONFIG.cta.icon;

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-background-dark/90 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-background-dark font-bold text-xl group-hover:scale-110 transition-transform">
              {NAVBAR_CONFIG.logo.letter}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-white">
                {NAVBAR_CONFIG.logo.title}
                <span className="text-primary">
                  {NAVBAR_CONFIG.logo.highlight}
                </span>
              </span>
              <span className="text-[10px] text-gray-400 tracking-[0.2em] uppercase">
                {NAVBAR_CONFIG.logo.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {NAVBAR_CONFIG.links.map((link) => (
              <NavLink key={link.path} to={link.path} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}

            <Link
              to={NAVBAR_CONFIG.cta.path}
              className="bg-primary hover:bg-primary-dark text-background-dark px-5 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105 shadow-[0_0_15px_rgba(242,208,13,0.3)] flex items-center gap-2"
            >
              <CTAIcon />
              {NAVBAR_CONFIG.cta.label}
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <span className="text-3xl">
                  <IoCloseSharp />
                </span>
              ) : (
                <span className="text-3xl">
                  <HiOutlineBars3BottomRight />
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background-dark border-t border-white/10">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {NAVBAR_CONFIG.links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-300 hover:bg-white/5"
              >
                {link.label}
              </NavLink>
            ))}

            <Link
              to={NAVBAR_CONFIG.cta.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block mt-4 text-center bg-primary text-background-dark px-3 py-3 rounded-md text-base font-bold"
            >
              {NAVBAR_CONFIG.cta.label}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

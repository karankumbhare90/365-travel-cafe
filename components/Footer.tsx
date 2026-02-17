import { IoIosCall } from "react-icons/io";
import { MdLocationOn, MdSchedule } from "react-icons/md";
import { Link } from "react-router-dom";

const FOOTER_CONFIG = {
  brand: {
    name: "TRAVEL",
    highlight: "CAFE",
    description:
      "Bringing the world's flavors to your table. Experience the journey without a passport.",
  },

  contact: [
    {
      icon: MdLocationOn,
      text: "Dumas Road, Surat, Gujarat 395007",
    },
    {
      icon: MdSchedule,
      text: "Open Daily: 11:00 AM - 11:00 PM",
    },
    {
      icon: IoIosCall,
      text: "+91 98765 43210",
    },
  ],

  bottomLinks: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Admin Login", to: "/admin" },
  ],
};

export const Footer = () => {
  return (
    <footer className="bg-surface-darker border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          {/* Brand */}
          <div>
            <span className="font-bold text-2xl tracking-tight text-white mb-2 block">
              {FOOTER_CONFIG.brand.name}
              <span className="text-primary">
                {FOOTER_CONFIG.brand.highlight}
              </span>
            </span>
            <p className="text-neutral-400 text-sm max-w-xs">
              {FOOTER_CONFIG.brand.description}
            </p>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col md:items-end gap-2 text-neutral-300 text-sm">
            {FOOTER_CONFIG.contact.map((item, index) => {
              const Icon = item.icon;

              return (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-primary text-base">
                    <Icon />
                  </span>
                  <span>{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
          <p>© 2023 Travel Cafe. All rights reserved.</p>

          <div className="flex gap-6">
            {FOOTER_CONFIG.bottomLinks.map((link, index) =>
              link.to ? (
                <Link
                  key={index}
                  to={link.to}
                  className="hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={index}
                  href={link.href}
                  className="hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ),
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useState, useEffect } from "react";
import { BiSolidCake } from "react-icons/bi";
import { FaCameraRetro, FaStar } from "react-icons/fa";
import { FaShop } from "react-icons/fa6";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoArrowForward } from "react-icons/io5";
import { LuBriefcaseBusiness } from "react-icons/lu";
import { MdFavorite, MdOutlineMenuBook } from "react-icons/md";
import { supabase } from "../lib/supabase";

const heroData = {
  badge: {
    icon: "FaStar",
    text: "Premium Events in Surat",
  },

  title: {
    line1: "Your Event,",
    line2: "Your Destination.",
  },

  description:
    "Celebrate life's journey at Surat's most immersive travel-themed venue. From intimate gatherings to grand departures, we curate memories that last a lifetime.",

  backgroundImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuB--qcowunGBmzYHNgjRnGHE9UbTLHnPGzpJ4PIei_wB3GLVFB_n99-feMnkVSmj9tAfC8PvPEV9rH__efrBL_m0EEp70cV6vyVw2kLbBATMpndwDUwdns7rGEbPJ5xnkqBwzP_Rd5xCW63K0TchyhopKXi62HPNNKiXM4UeczKxtjDp2DteF6ZaR0mQaVsjz93MgS6vyz_OeUHpWOU6jFqR9pnxH6OWUEDlP5FcY44O_bklYwRjYH75_JHGVnD3q55lRl8MUyVjzs",
};

const Events: React.FC = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState("cake");

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const { data, error } = await supabase
      .from("plans")
      .select(
        `
       *,
       plan_features (
         id,
         feature
       )
     `,
      )
      .order("price", { ascending: true });

    if (!error) {
      setPlans(data);
    }
  };

  const filteredPlans = plans.filter((plan) => plan.type === selectedType);

  return (
    <div className="bg-background-dark min-h-screen">
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroData.backgroundImage}
            alt="Events"
            className="w-full h-full object-cover opacity-60"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl px-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm mb-6">
            <span className="react-icons text-primary text-sm">
              <FaStar />
            </span>

            <span className="text-primary text-sm font-semibold tracking-wide uppercase">
              {heroData.badge.text}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-white">
            {heroData.title.line1}

            <br />

            <span className="text-primary">{heroData.title.line2}</span>
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            {heroData.description}
          </p>
        </div>
      </section>

      {/* Binding with DB data */}
      <div className="sticky top-20 z-40 bg-background-dark/95 backdrop-blur-md border-y border-white/5 py-4 overflow-x-auto hide-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-4 min-w-max">
            <button
              onClick={() => setSelectedType("cake")}
              className={`flex items-center gap-3 px-6 py-2 rounded-lg border ${
                selectedType === "cake"
                  ? "bg-primary/10 border-primary/20 text-primary"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <BiSolidCake />
              <span className="font-bold">Cake</span>
            </button>

            <button
              onClick={() => setSelectedType("anniversary")}
              className={`flex items-center gap-3 px-6 py-2 rounded-lg border ${
                selectedType === "anniversary"
                  ? "bg-primary/10 border-primary/20 text-primary"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <MdFavorite />
              Anniversary
            </button>

            <button
              onClick={() => setSelectedType("corporate")}
              className={`flex items-center gap-3 px-6 py-2 rounded-lg border ${
                selectedType === "corporate"
                  ? "bg-primary/10 border-primary/20 text-primary"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <LuBriefcaseBusiness />
              Corporate
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-pattern-dots">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            First Class Packages
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Choose your destination class. All packages include our signature
            travel-themed ambiance and dedicated cabin crew service.
          </p>
        </div>

        {/* Card */}
        <div className="grid md:grid-cols-3 gap-8">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="group bg-surface-dark rounded-2xl overflow-hidden border-2 border-white/5 hover:border-primary/75 transition-all duration-300 hover:-translate-y-2 shadow-lg"
            >
              {/* IMAGE */}
              <div className="relative h-56">
                <img
                  src={plan.image_url}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {plan.label && (
                  <div className="absolute top-4 right-4 bg-background-dark/80 backdrop-blur px-3 py-1 rounded text-xs font-bold text-white uppercase border border-white/10">
                    {plan.label}
                  </div>
                )}

                {plan.badge && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-primary text-background-dark text-xs font-bold px-4 py-1 rounded-b-lg z-20">
                    {plan.badge}
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-white">
                  {plan.title}
                </h3>

                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                {/* FEATURES */}
                <div className="space-y-3 mb-8">
                  {plan.plan_features?.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-start gap-3 text-sm text-gray-300"
                    >
                      <span className="text-primary text-lg">
                        <IoMdCheckmarkCircleOutline />
                      </span>

                      <span>{feature.feature}</span>
                    </div>
                  ))}
                </div>

                {/* PRICE */}
                <div className="flex items-end justify-between border-t border-white/10 pt-4">
                  <div>
                    <span className="text-xs text-gray-500 uppercase block">
                      Starting from
                    </span>

                    <span className="text-2xl font-bold text-primary">
                      ₹{plan.price}
                    </span>
                  </div>
                  <button className="p-2 rounded-full bg-primary/20 text-primary hover:bg-primary hover:text-background-dark transition-colors">
                    <IoArrowForward />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;

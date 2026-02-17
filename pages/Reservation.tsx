import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
  MdFlightTakeoff,
  MdGroup,
  MdLocalPhone,
  MdPerson,
  MdSchedule,
} from "react-icons/md";
import { LiaHourglassStartSolid } from "react-icons/lia";
import { IoClose } from "react-icons/io5";
import {
  IoMdArrowDropdown,
  IoMdCalendar,
  IoMdCheckmarkCircleOutline,
} from "react-icons/io";
import { FaShop } from "react-icons/fa6";
import { BiSolidCake } from "react-icons/bi";
import { MdFavorite } from "react-icons/md";

const Reservation: React.FC = () => {
  const [formData, setFormData] = useState({
    passengerName: "",
    contactNumber: "",
    email: "",
    pax: "2",
    date: "",
    time: "",
    tripType: "Casual",
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const icons = [FaShop, BiSolidCake, MdFavorite];
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    const { error } = await supabase.from("reservations").insert([
      {
        passenger_name: formData.passengerName,
        contact_number: formData.contactNumber,
        email: formData.email,
        pax_count: parseInt(formData.pax),
        departure_date: formData.date,
        departure_time: formData.time,
        trip_type: formData.tripType,
        status: "pending",
      },
    ]);

    if (error) {
      console.error("Error submitting:", error);
      setStatus("error");
      setErrorMsg(
        "Could not process reservation. Please try again or call us directly.",
      );
    } else {
      setStatus("success");
      const form = new FormData();

      form.append("action", "new_booking");
      form.append("name", formData.passengerName);
      form.append("phone", formData.contactNumber);
      form.append("email", formData.email);
      form.append("pax", formData.pax);
      form.append("date", formData.date);
      form.append("time", formData.time);
      form.append("tripType", formData.tripType);

      await fetch(import.meta.env.VITE_GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: form
      });
     
       setStatus("success");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (type: string) => {
    setFormData((prev) => ({ ...prev, tripType: type }));
  };

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-dark text-white px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="react-icons text-4xl text-green-500">
              <IoMdCheckmarkCircleOutline />
            </span>
          </div>
          <h2 className="text-3xl font-serif font-bold mb-4">
            Boarding Pass Confirmed!
          </h2>
          <p className="text-gray-400 mb-8">
            Thank you, {formData.passengerName}. Your table request has been
            received. We will call you shortly to confirm your flight.
          </p>
          <Link
            to="/"
            className="bg-primary text-background-dark px-8 py-3 rounded-full font-bold hover:bg-white transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background-dark text-white font-sans">
      {/* Navigation Overlay */}
      <nav className="absolute top-0 left-0 w-full z-50 py-6 px-6 lg:px-12 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="react-icons text-primary text-3xl">
            <MdFlightTakeoff />
          </span>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white">
              365 The Travel Cafe
            </span>
            <span className="text-xs text-primary/80 font-medium uppercase tracking-widest">
              Surat, India
            </span>
          </div>
        </Link>
        <Link
          to="/"
          className="text-sm font-medium text-white/80 hover:text-primary transition-colors"
        >
          <span className="react-icons text-lg">
            <IoClose />
          </span>
        </Link>
      </nav>

      {/* Left Panel: Form */}
      <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-center px-6 py-24 lg:px-16 xl:px-20 relative z-10 bg-surface-darker/95 lg:bg-surface-darker">
        <div className="mb-8 mt-10 lg:mt-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Now Boarding
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-2 leading-tight">
            Reserve Your <span className="text-primary">Seat</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Prepare for a culinary journey. Secure your table for an
            unforgettable experience.
          </p>
        </div>

        {status === "error" && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
              Passenger Name
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="react-icons text-gray-500 group-focus-within:text-primary">
                  <MdPerson />
                </span>
              </div>
              <input
                type="text"
                name="passengerName"
                value={formData.passengerName}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-4 bg-background-dark border border-gray-700 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-white placeholder-gray-600 outline-none transition-all shadow-lg"
                placeholder="e.g. Rahul Sharma"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                Contact Number
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="react-icons text-gray-500 group-focus-within:text-primary">
                    <MdLocalPhone />
                  </span>
                </div>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-background-dark border border-gray-700 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-white placeholder-gray-600 outline-none transition-all shadow-lg"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                Email Address
              </label>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="react-icons text-gray-500">
                    <MdPerson />
                  </span>
                </div>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="rahul@gmail.com"
                  className="w-full pl-12 pr-4 py-4 bg-background-dark border border-gray-700 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary placeholder-gray-600 text-white outline-none shadow-lg"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
              Passengers (Pax)
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="react-icons text-gray-500 group-focus-within:text-primary">
                  <MdGroup />
                </span>
              </div>
              <select
                name="pax"
                value={formData.pax}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-background-dark border border-gray-700 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-white outline-none transition-all appearance-none cursor-pointer shadow-lg"
              >
                <option value="2">2 Travelers</option>
                <option value="3">3 Travelers</option>
                <option value="4">4 Travelers</option>
                <option value="5">5+ Travelers</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500">
                <span className="react-icons">
                  <IoMdArrowDropdown />
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                Departure Date
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="react-icons text-gray-500 group-focus-within:text-primary">
                    <IoMdCalendar />
                  </span>
                </div>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-background-dark border border-gray-700 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-white outline-none transition-all shadow-lg"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                Departure Time
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="react-icons text-gray-500 group-focus-within:text-primary">
                    <MdSchedule />
                  </span>
                </div>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-4 bg-background-dark border border-gray-700 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary text-white outline-none transition-all shadow-lg"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
              Trip Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Casual", "Birthday", "Date Night"].map((type, idx) => {
                const Icon = icons[idx];

                return (
                  <label key={idx} className="cursor-pointer">
                    <input
                      type="radio"
                      name="tripType"
                      className="peer sr-only"
                      checked={formData.tripType === type}
                      onChange={() => handleRadioChange(type)}
                    />

                    <div className="flex flex-col items-center justify-center py-3 bg-background-dark border border-gray-700 rounded-xl peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary text-gray-400 hover:bg-white/5 transition-all">
                      <span className="text-lg mb-1">
                        <Icon />
                      </span>

                      <span className="text-xs font-bold">{type}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full group relative flex items-center justify-center py-4 px-6 border border-transparent text-base font-bold rounded-xl text-background-dark bg-primary hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(242,208,13,0.3)] mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="flex items-center pr-3">
              <span className="react-icons group-hover:translate-x-1 transition-transform">
                {status === "submitting" ? (
                  <LiaHourglassStartSolid />
                ) : (
                  <MdFlightTakeoff />
                )}
              </span>
            </span>
            {status === "submitting" ? "Confirming..." : "Confirm Reservation"}
          </button>
        </form>
      </div>

      {/* Right Panel: Image */}
      <div className="hidden lg:block lg:w-[55%] xl:w-[60%] relative overflow-hidden bg-background-dark">
        <img
          src="https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2670&auto=format&fit=crop"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          alt="Dining"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-darker via-surface-darker/60 to-transparent"></div>
        <div className="absolute bottom-20 left-12 right-12 max-w-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-primary"></div>
            <span className="text-primary font-bold uppercase tracking-widest text-sm">
              Destination: Fine Dining
            </span>
          </div>
          <blockquote className="text-3xl font-light text-white italic leading-relaxed mb-6">
            "The journey is as tasty as the destination. Experience world-class
            flavors right here in Surat."
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-300">
              <span className="text-primary font-bold">4.9/5</span> Rating from
              happy travelers
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;

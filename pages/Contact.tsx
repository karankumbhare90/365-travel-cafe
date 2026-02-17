import React, { useState } from "react";
import { supabase } from "../lib/supabase";
import { IoMdArrowForward } from "react-icons/io";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx1ISUcMMgFB5fjvwKVdyaNIin9lpi_Ux19qUXh013LzG8v7U_OXj2CCso6EYWoMFaV/exec"

const Contact: React.FC = () => {

   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [phone, setPhone] = useState("");
   const [message, setMessage] = useState("");

   const [loading, setLoading] = useState(false);
   const [success, setSuccess] = useState("");
   const [errorMsg, setErrorMsg] = useState("");

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      setLoading(true);
      setSuccess("");
      setErrorMsg("");

      try {

         // Save in Supabase
         const { error } = await supabase
            .from("contact_inquiries")
            .insert([{ name, email, phone, message }]);

         if (error) throw error;

         // Send to Google Sheets + Email
         await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            body: JSON.stringify({
               name,
               email,
               phone,
               message,
            }),
         });

         setSuccess("Message sent successfully!");
         setName("");
         setEmail("");
         setPhone("");
         setMessage("");

      } catch (err) {
         console.error(err);
         setErrorMsg("Failed to send message");
      }

      setLoading(false);
   };

   return (
      <div className="bg-background-dark min-h-screen">

         {/* HEADER */}
         <div className="relative py-20 lg:py-28 overflow-hidden text-center">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

            <div className="relative max-w-7xl mx-auto px-4">

               <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
                  Find Your Way to
                  <span className="text-primary"> Taste</span>
               </h1>

               <p className="text-gray-400 text-xl">
                  A culinary journey awaits you in Surat.
               </p>

            </div>
         </div>

         {/* CONTENT */}
         <div className="max-w-7xl mx-auto px-4 pb-24">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

               {/* LEFT COLUMN */}
               <div className="lg:col-span-5">

                  <div className="bg-surface-dark p-8 rounded-xl border border-white/5">

                     <h3 className="text-xl font-bold text-white mb-6">
                        Send an Inquiry
                     </h3>

                     <form onSubmit={handleSubmit} className="space-y-4">

                        <input
                           required
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                           placeholder="Name"
                           className="w-full bg-background-dark border border-gray-700 rounded-lg px-4 py-3 text-white"
                        />

                        <div className="grid grid-cols-2 gap-4">

                           <input
                              required
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Email"
                              className="w-full bg-background-dark border border-gray-700 rounded-lg px-4 py-3 text-white"
                           />

                           <input
                              required
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="Phone"
                              className="w-full bg-background-dark border border-gray-700 rounded-lg px-4 py-3 text-white"
                           />

                        </div>

                        <textarea
                           required
                           value={message}
                           onChange={(e) => setMessage(e.target.value)}
                           placeholder="Message"
                           rows={4}
                           className="w-full bg-background-dark border border-gray-700 rounded-lg px-4 py-3 text-white"
                        />

                        <button
                           type="submit"
                           disabled={loading}
                           className="w-full bg-primary text-background-dark font-bold py-3 rounded-lg"
                        >
                           {loading ? "Sending..." : "Send Message"}
                        </button>

                        {success && (
                           <p className="text-green-400 text-center">{success}</p>
                        )}

                        {errorMsg && (
                           <p className="text-red-400 text-center">{errorMsg}</p>
                        )}

                     </form>

                  </div>

               </div>

               {/* RIGHT COLUMN — MAP */}
               <div className="lg:col-span-7 min-h-[500px]">

                  <div className="h-full bg-surface-dark rounded-2xl border border-white/5 overflow-hidden">

                     <iframe className="w-full h-full grayscale invert brightness-90 contrast-125 hover:grayscale-0 hover:invert-0 hover:brightness-100 hover:contrast-100 transition-all duration-500" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.669830547631!2d72.78465731493488!3d21.165538985924765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04dec8b56fdf3%3A0x675844876b537568!2sCity%20Light%20Town%2C%20Surat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" loading="lazy"> </iframe> <div className="absolute bottom-6 right-6 z-10"> <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="bg-primary hover:bg-white text-background-dark hover:text-primary font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 flex items-center"> <span className="react-icons mr-2"><IoMdArrowForward/></span> Get Directions </a> </div>

                  </div>

               </div>

            </div>

         </div>

      </div>
   );
};

export default Contact;
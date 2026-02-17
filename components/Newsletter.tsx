import React, { useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";

interface NewsletterSectionProps {
  title?: string;
  description?: string;
  tableName?: string;
  buttonText?: string;
}

export const NewsletterSection: React.FC<NewsletterSectionProps> = ({
  title = "Join the Frequent Flyer Club",
  description = "Subscribe for exclusive travel deals, secret menu items, and event invites.",
  tableName = "newsletter_subscribers",
  buttonText = "Subscribe",
}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState(false);

  // ✅ Email validation
  const isValidEmail = useMemo(() => {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    return emailRegex.test(email);
  }, [email]);

  const isDisabled = !email || !isValidEmail || loading;

  const handleSubscribe = async () => {
    if (!isValidEmail) return;

    setLoading(true);
    setMessage("");

    const { error } = await supabase
      .from(tableName)
      .insert([{ email }]);

    if (error) {
      if (error.code === "23505") {
        setMessage("You are already subscribed!");
      } else {
        setMessage("Something went wrong.");
      }
    } else {
      setMessage("Successfully subscribed!");
      setEmail("");
      setTouched(false);
    }

    setLoading(false);
  };

  return (
    <section className="py-16 bg-primary">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-background-dark mb-4 font-serif">
          {title}
        </h2>

        <p className="text-background-dark/80 mb-8 font-medium">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            className={`flex-1 px-6 py-4 rounded-full bg-white/20 border ${
              touched && !isValidEmail
                ? "border-red-500"
                : "border-black/10"
            }`}
          />

          <button
            onClick={handleSubscribe}
            disabled={isDisabled}
            className={`px-8 py-4 rounded-full font-bold transition-all ${
              isDisabled
                ? "bg-background-dark/50 text-white/60 cursor-not-allowed"
                : "bg-background-dark text-white hover:opacity-90"
            }`}
          >
            {loading ? "Subscribing..." : buttonText}
          </button>
        </div>

        {/* Validation Error */}
        {touched && email && !isValidEmail && (
          <p className="mt-3 text-red-600 font-medium">
            Please enter a valid email address.
          </p>
        )}

        {/* Success / Server Message */}
        {message && (
          <p className="mt-3 text-background-dark font-semibold">
            {message}
          </p>
        )}
      </div>
    </section>
  );
};
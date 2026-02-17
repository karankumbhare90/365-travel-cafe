import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { FaStar } from "react-icons/fa";
import { IoTrash, IoCreateOutline } from "react-icons/io5";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
}

const ManageTestimonials: React.FC = () => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");
  const [rating, setRating] = useState(5);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setItems(data);
  };

  const resetForm = () => {
    setName("");
    setRole("");
    setQuote("");
    setRating(5);
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!name || !role || !quote) return;

    setLoading(true);

    if (editingId) {
      await supabase
        .from("testimonials")
        .update({ name, role, quote, rating })
        .eq("id", editingId);
    } else {
      await supabase.from("testimonials").insert([
        { name, role, quote, rating },
      ]);
    }

    resetForm();
    fetchTestimonials();
    setLoading(false);
  };

  const handleEdit = (item: Testimonial) => {
    setEditingId(item.id);
    setName(item.name);
    setRole(item.role);
    setQuote(item.quote);
    setRating(item.rating);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("testimonials").delete().eq("id", id);
    fetchTestimonials();
  };

  return (
    <div>
      <h1 className="text-xl lg:text-xl lg:text-3xl font-bold font-serif mb-8">
        Manage Testimonials
      </h1>

      {/* ================= FORM ================= */}
      <div className="bg-surface-dark p-6 rounded-xl border border-white/5 mb-10">
        <h2 className="text-lg font-bold mb-6 text-white">
          {editingId ? "Edit Testimonial" : "Add Testimonial"}
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Name */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Author Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-background-dark border border-white/10 text-white focus:border-primary outline-none"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-background-dark border border-white/10 text-white focus:border-primary outline-none"
            />
          </div>

          {/* Rating */}
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-2">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="text-xl"
                >
                    <span className={`${
                      star <= rating
                        ? "text-primary"
                        : "text-gray-600"
                    }`}>
                        <FaStar />
                    </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quote */}
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-2">
              Quote
            </label>
            <textarea
              rows={4}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-background-dark border border-white/10 text-white focus:border-primary outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="md:col-span-2 flex gap-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-primary text-black font-bold py-3 rounded-xl hover:opacity-90 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Testimonial"
                : "Add Testimonial"}
            </button>

            {editingId && (
              <button
                onClick={resetForm}
                className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-surface-dark rounded-xl border border-white/5 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 text-gray-400 text-xs uppercase">
              <th className="p-4">Author</th>
              <th className="p-4">Role</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Quote</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5 text-sm">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-white/5">
                <td className="p-4 font-bold text-white">
                  {item.name}
                </td>

                <td className="p-4 text-gray-300">
                  {item.role}
                </td>

                <td className="p-4">
                  <div className="flex gap-1 text-primary">
                    {[...Array(item.rating)].map((_, i) => (
                        <span key={i}>
                            <FaStar />
                        </span>
                    ))}
                  </div>
                </td>

                <td className="p-4 text-gray-400 max-w-xs truncate">
                  {item.quote}
                </td>

                <td className="p-4 text-right flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-black transition"
                  >
                    <IoCreateOutline />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-black transition"
                  >
                    <IoTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {items.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No testimonials found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTestimonials;
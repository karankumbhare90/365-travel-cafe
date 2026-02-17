import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { IoTrash, IoCreateOutline } from "react-icons/io5";

interface GalleryItem {
  id: string;
  title: string;
  label: string;
  image_url: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ManageGallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [title, setTitle] = useState("");
  const [label, setLabel] = useState("Ambience");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    const { data } = await supabase
      .from("gallery_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setItems(data);
  };

  /* ================= FILE HANDLING ================= */

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files allowed.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File must be under 5MB.");
      return;
    }

    setError(null);
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImageFile(null);
    setPreview(null);
  };

  const resetForm = () => {
    setTitle("");
    setLabel("Ambience");
    setEditingId(null);
    removeImage();
  };

  /* ================= SAVE (CREATE OR UPDATE) ================= */

  const handleSave = async () => {
    if (!title || !label) {
      setError("Title and Category are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let imageUrl: string | undefined;

      // If new image selected, upload it
      if (imageFile) {
        const filePath = `gallery/${Date.now()}-${imageFile.name}`;

        const { error: uploadError } = await supabase.storage
          .from("gallery")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("gallery")
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }

      if (editingId) {
        // UPDATE
        await supabase
          .from("gallery_items")
          .update({
            title,
            label,
            ...(imageUrl && { image_url: imageUrl }),
          })
          .eq("id", editingId);
      } else {
        // CREATE
        if (!imageUrl) {
          setError("Image is required.");
          setLoading(false);
          return;
        }

        await supabase.from("gallery_items").insert([
          {
            title,
            label,
            image_url: imageUrl,
          },
        ]);
      }

      resetForm();
      fetchGallery();
    } catch (err: any) {
      setError(err.message || "Operation failed.");
    }

    setLoading(false);
  };

  /* ================= EDIT ================= */

  const handleEdit = (item: GalleryItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setLabel(item.label);
    setPreview(item.image_url);
    setImageFile(null);
  };

  /* ================= DELETE ================= */

  const deleteItem = async (id: string) => {
    await supabase.from("gallery_items").delete().eq("id", id);
    fetchGallery();
  };

  return (
    <div>
      <h1 className="text-xl lg:text-xl lg:text-3xl font-bold font-serif mb-8">
        Manage Gallery
      </h1>

      {/* ================= FORM ================= */}
      <div className="bg-surface-dark p-6 rounded-xl border border-white/5 mb-10">
        <h2 className="text-lg font-bold mb-4 text-white">
          {editingId ? "Edit Gallery Item" : "Add New Gallery Image"}
        </h2>

        <div className="grid md:grid-cols-2 gap-8">

          {/* IMAGE PICKER */}
          <div
            className="relative"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFileChange(e.dataTransfer.files[0]);
            }}
          >
            {!preview ? (
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-primary transition-all bg-background-dark text-gray-400 hover:text-primary"
              >
                Click or Drag Image
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleFileChange(
                      e.target.files ? e.target.files[0] : null
                    )
                  }
                />
              </label>
            ) : (
              <div className="relative group">
                <img
                  src={preview}
                  alt="Preview"
                  className="h-64 w-full object-cover rounded-2xl border border-white/10"
                />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4 rounded-2xl">
                  <label
                    htmlFor="image-upload"
                    className="px-4 py-2 text-sm font-bold bg-primary text-black rounded-lg cursor-pointer"
                  >
                    Replace
                  </label>

                  <button
                    type="button"
                    onClick={removeImage}
                    className="px-4 py-2 text-sm font-bold bg-red-500 text-white rounded-lg"
                  >
                    Remove
                  </button>
                </div>

                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    handleFileChange(
                      e.target.files ? e.target.files[0] : null
                    )
                  }
                />
              </div>
            )}
          </div>

          {/* FORM SIDE */}
          <div className="flex flex-col gap-6">

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background-dark border border-white/10 text-white focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Category
              </label>
              <select
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background-dark border border-white/10 text-white focus:border-primary outline-none"
              >
                <option>Ambience</option>
                <option>Food</option>
                <option>Drinks</option>
                <option>Events</option>
                <option>Decor</option>
              </select>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-primary text-black font-bold py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Item"
                  : "Add Gallery Item"}
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

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-surface-dark rounded-xl border border-white/5 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 text-gray-400 text-xs uppercase">
              <th className="p-4">Preview</th>
              <th className="p-4">Title</th>
              <th className="p-4">Label</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5 text-sm">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-white/5">
                <td className="p-4">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>

                <td className="p-4 text-white font-bold">
                  {item.title}
                </td>

                <td className="p-4 text-gray-300">
                  {item.label}
                </td>

                <td className="p-4 text-right flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-black transition"
                  >
                    <IoCreateOutline />
                  </button>

                  <button
                    onClick={() => deleteItem(item.id)}
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
            No gallery items found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageGallery;
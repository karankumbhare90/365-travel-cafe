import React, { useEffect, useState } from 'react';
import imageCompression from 'browser-image-compression';
import { supabase } from '../../lib/supabase';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { HiOutlinePencilAlt } from 'react-icons/hi';

interface MenuItem {
  id?: string;
  title: string;
  description: string;
  price: number;
  time_estimate: string;
  category: string;
  image_url: string;
  is_veg: boolean;
  is_spicy: boolean;
  is_bestseller: boolean;
}

const ManageMenu: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState<MenuItem>({
    title: '', description: '', price: 0, time_estimate: '15 mins',
    category: 'Starters', image_url: '', is_veg: true, is_spicy: false, is_bestseller: false
  });

  const fetchItems = async () => {
    const { data, error } = await supabase.from('menu_items').select('*').order('created_at', { ascending: false });
    if (!error && data) setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      // Convert to WebP
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        fileType: 'image/webp'
      };

      const compressedFile = await imageCompression(file, options);

      const fileName = `${Date.now()}.webp`;

      // Upload to Supabase Storage
      const { error } = await supabase.storage
        .from('menu-images')
        .upload(fileName, compressedFile, {
          contentType: 'image/webp',
          upsert: true
        });

      if (error) {
        console.error(error);
        return;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('menu-images')
        .getPublicUrl(fileName);

      // Save URL to state
      setCurrentItem({
        ...currentItem,
        image_url: data.publicUrl
      });

    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (currentItem.id) {
      // Update
      await supabase.from('menu_items').update(currentItem).eq('id', currentItem.id);
    } else {
      // Create
      await supabase.from('menu_items').insert([currentItem]);
    }

    setIsEditing(false);
    setCurrentItem({
      title: '', description: '', price: 0, time_estimate: '15 mins',
      category: 'Starters', image_url: '', is_veg: true, is_spicy: false, is_bestseller: false
    });
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      await supabase.from('menu_items').delete().eq('id', id);
      fetchItems();
    }
  };

  const handleEdit = (item: MenuItem) => {
    setCurrentItem(item);
    setIsEditing(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8 flex-wrap gap-5">
        <h1 className="text-xl lg:text-xl lg:text-3xl font-bold font-serif">Menu Management</h1>
        <button
          onClick={() => {
            setCurrentItem({
              title: '', description: '', price: 0, time_estimate: '15 mins',
              category: 'Starters', image_url: '', is_veg: true, is_spicy: false, is_bestseller: false
            });
            setIsEditing(true);
          }}
          className=" bg-primary text-background-dark px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg font-bold flex items-center gap-2"
        >
          <span className="react-icons text-sm flex-shrink-0">
            <FiPlus />
          </span> Add Item
        </button>
      </div>

      {isEditing && (
        <div className="bg-surface-dark p-6 rounded-xl border border-white/10 mb-8 animate-fade-in-up">
          <h2 className="text-xl font-bold mb-4">{currentItem.id ? 'Edit Item' : 'New Menu Item'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="input-field" placeholder="Title" value={currentItem.title} onChange={e => setCurrentItem({ ...currentItem, title: e.target.value })} required />
              <input className="input-field" placeholder="Category" value={currentItem.category} onChange={e => setCurrentItem({ ...currentItem, category: e.target.value })} required />
              <input className="input-field" type="number" placeholder="Price" value={currentItem.price} onChange={e => setCurrentItem({ ...currentItem, price: parseFloat(e.target.value) })} required />
              <input className="input-field" placeholder="Time (e.g. 15 mins)" value={currentItem.time_estimate} onChange={e => setCurrentItem({ ...currentItem, time_estimate: e.target.value })} />
            </div>
            <textarea className="input-field w-full" rows={2} placeholder="Description" value={currentItem.description} onChange={e => setCurrentItem({ ...currentItem, description: e.target.value })} />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="input-field w-full"
            />
            {currentItem.image_url && (
              <img
                src={currentItem.image_url}
                className="w-32 h-32 object-cover rounded"
              />
            )}

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={currentItem.is_veg} onChange={e => setCurrentItem({ ...currentItem, is_veg: e.target.checked })} className="accent-primary w-4 h-4" />
                <span className="text-sm">Vegetarian</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={currentItem.is_spicy} onChange={e => setCurrentItem({ ...currentItem, is_spicy: e.target.checked })} className="accent-primary w-4 h-4" />
                <span className="text-sm">Spicy</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={currentItem.is_bestseller} onChange={e => setCurrentItem({ ...currentItem, is_bestseller: e.target.checked })} className="accent-primary w-4 h-4" />
                <span className="text-sm">Bestseller</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
              <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button type="submit" className="bg-primary text-background-dark px-6 py-2 rounded-lg font-bold">Save Item</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-surface-dark rounded-xl overflow-hidden border border-white/5 flex flex-col">
            <div className="h-48 relative">
              <img src={item.image_url || 'https://via.placeholder.com/400'} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 flex gap-2">
                <button onClick={() => handleEdit(item)} className="p-2 bg-black/50 backdrop-blur rounded-full text-white hover:bg-primary hover:text-black transition-colors">
                  <span className="react-icons text-sm flex-shrink-0">
                    <HiOutlinePencilAlt />
                  </span>
                </button>
                <button onClick={() => item.id && handleDelete(item.id)} className="p-2 bg-black/50 backdrop-blur rounded-full text-white hover:bg-red-600 transition-colors">
                  <span className="react-icons text-sm flex-shrink-0">
                    <FiTrash2 />
                  </span>
                </button>
              </div>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{item.title}</h3>
                <span className="text-primary font-bold">₹{item.price}</span>
              </div>
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">{item.category}</p>
              <p className="text-sm text-gray-400 line-clamp-2 mb-4">{item.description}</p>
              <div className="mt-auto flex gap-2">
                {item.is_veg && <span className="text-[10px] border border-green-500 text-green-500 px-2 py-0.5 rounded">VEG</span>}
                {item.is_spicy && <span className="text-[10px] border border-red-500 text-red-500 px-2 py-0.5 rounded">SPICY</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .input-field {
            width: 100%;
            background-color: #221f10;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 0.5rem;
            padding: 0.75rem 1rem;
            color: white;
            outline: none;
        }
        .input-field:focus {
            border-color: #f2d00d;
        }
      `}</style>
    </div>
  );
};

export default ManageMenu;
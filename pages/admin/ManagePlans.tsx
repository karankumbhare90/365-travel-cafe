import React, { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";
import { supabase } from "../../lib/supabase";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { HiOutlinePencilAlt } from "react-icons/hi";

interface Feature {
  id?: string;
  feature: string;
}

interface Plan {
  id?: string;
  type: string;
  title: string;
  description: string;
  image_url: string;
  price: number;
  label: string;
  badge: string;
  plan_features: Feature[];
}

const ManagePlans = () => {
  const emptyPlan: Plan = {
    type: "cake",
    title: "",
    description: "",
    image_url: "",
    price: 0,
    label: "",
    badge: "",
    plan_features: [{ feature: "" }],
  };

  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<Plan>(emptyPlan);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const { data } = await supabase
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
      .order("created_at", { ascending: false });

    setPlans(data || []);
  };

  // IMAGE UPLOAD
  const handleImageUpload = async (e: any) => {

    const file = e.target.files?.[0];
    if (!file) return;
  
    try {
  
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        fileType: "image/webp",
      });
  
      const fileName = `${Date.now()}.webp`;
  
      // store inside folder
      const filePath = `plans/${fileName}`;
  
      const { error: uploadError } = await supabase.storage
        .from("plan-images")
        .upload(filePath, compressed, {
          contentType: "image/webp",
          upsert: true,
        });
  
      if (uploadError) {
        console.error(uploadError);
        alert("Upload failed");
        return;
      }
  
      const { data } = supabase.storage
        .from("plan-images")
        .getPublicUrl(filePath);
  
      if (!data?.publicUrl) {
        alert("Failed to get image URL");
        return;
      }
  
      setCurrentPlan(prev => ({
        ...prev,
        image_url: data.publicUrl,
      }));
  
    } catch (err) {
      console.error(err);
    }
  
  };

  // FEATURE HANDLING
  const addFeature = () => {
    setCurrentPlan({
      ...currentPlan,
      plan_features: [...currentPlan.plan_features, { feature: "" }],
    });
  };

  const updateFeature = (index: number, value: string) => {
    const updated = [...currentPlan.plan_features];
    updated[index].feature = value;

    setCurrentPlan({
      ...currentPlan,
      plan_features: updated,
    });
  };

  const removeFeature = (index: number) => {
    const updated = currentPlan.plan_features.filter((_, i) => i !== index);

    setCurrentPlan({
      ...currentPlan,
      plan_features: updated,
    });
  };

  // SAVE PLAN
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    try {
      let planId = currentPlan.id;

      // Extract only plans table fields
      const planData = {
        type: currentPlan.type,
        title: currentPlan.title,
        description: currentPlan.description,
        image_url: currentPlan.image_url,
        price: currentPlan.price,
        label: currentPlan.label,
        badge: currentPlan.badge,
      };

      if (planId) {
        // UPDATE PLAN
        const { error } = await supabase
          .from("plans")
          .update(planData)
          .eq("id", planId);

        if (error) throw error;

        // DELETE OLD FEATURES
        await supabase.from("plan_features").delete().eq("plan_id", planId);
      } else {
        // INSERT PLAN
        const { data, error } = await supabase
          .from("plans")
          .insert([planData])
          .select()
          .single();

        if (error) throw error;

        if (!data) throw new Error("Plan insert failed");

        planId = data.id;
      }

      // INSERT FEATURES
      const featuresInsert = currentPlan.plan_features
        .filter((f) => f.feature.trim() !== "")
        .map((f) => ({
          plan_id: planId,
          feature: f.feature,
        }));

      if (featuresInsert.length > 0) {
        const { error } = await supabase
          .from("plan_features")
          .insert(featuresInsert);

        if (error) throw error;
      }

      setIsEditing(false);
      setCurrentPlan(emptyPlan);

      fetchPlans();
    } catch (err) {
      console.error("Error saving plan:", err);
      alert("Failed to save plan");
    }

    setLoading(false);
  };

  // DELETE
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this plan?")) return;

    await supabase.from("plans").delete().eq("id", id);

    fetchPlans();
  };

  const handleEdit = (plan: Plan) => {
    setCurrentPlan(plan);
    setIsEditing(true);
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between mb-8 flex-wrap">
        <h1 className="text-xl lg:text-3xl font-bold font-serif">Plans Management</h1>

        <button
          onClick={() => {
            setCurrentPlan(emptyPlan);
            setIsEditing(true);
          }}
          className="bg-primary text-background-dark px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg font-bold flex items-center gap-2"
        >
          <FiPlus /> Add Plan
        </button>
      </div>

      {/* FORM */}
      {isEditing && (
        <div className="bg-surface-dark p-6 rounded-xl border border-white/10 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold mb-4">
              {isEditing.id ? "Edit Item" : "New Plan"}
            </h2>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Title</label>
              <input
                className="input-field"
                placeholder="Title"
                value={currentPlan.title}
                onChange={(e) =>
                  setCurrentPlan({
                    ...currentPlan,
                    title: e.target.value,
                  })
                }
              />
            </div>
            <div className="w-full">
              <label className="block text-sm text-gray-400 mb-2">
                Description
              </label>
              <textarea
                className="input-field"
                placeholder="Description"
                value={currentPlan.description}
                onChange={(e) =>
                  setCurrentPlan({
                    ...currentPlan,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Type</label>
                <select
                  value={currentPlan.type}
                  onChange={(e) =>
                    setCurrentPlan({
                      ...currentPlan,
                      type: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-background-dark border border-white/10 text-white focus:border-primary outline-none"
                >
                  <option value="cake">Cake</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="corporate">Corporate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Price
                </label>
                <input
                  className="input-field"
                  type="number"
                  placeholder="Price"
                  value={currentPlan.price}
                  onChange={(e) =>
                    setCurrentPlan({
                      ...currentPlan,
                      price: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <input
                  type="file"
                  onChange={handleImageUpload}
                  className="input-field"
                />

                {currentPlan.image_url && (
                  <img
                    src={currentPlan.image_url}
                    className="w-32 h-32 object-cover rounded mt-4"
                  />
                )}
              </div>
              
                <div className="flex flex-col items-start justify-start w-full gap-4">
                  <div className="w-full">
                  <input
                  className="input-field w-full"
                  placeholder="Label"
                  value={currentPlan.label}
                  onChange={(e) =>
                    setCurrentPlan({
                      ...currentPlan,
                      label: e.target.value,
                    })
                  }
                />
                  </div>
                  <div className="w-full">
                    <input
                      className="input-field w-full"
                      placeholder="Badge"
                      value={currentPlan.badge}
                      onChange={(e) =>
                        setCurrentPlan({
                          ...currentPlan,
                          badge: e.target.value,
                        })
                      }
                    />
                  </div>
                  {/* FEATURES */}
                  <div className="flex justify-between mb-2 w-full">
                    <span>Features</span>

                    <button
                      type="button"
                      onClick={addFeature}
                      className="text-primary"
                    >
                      Add Feature
                    </button>
                  </div>

                  {currentPlan.plan_features.map((f, i) => (
                    <div key={i} className="flex gap-2 mb-2 w-full">
                      <input
                        className="input-field"
                        value={f.feature}
                        onChange={(e) => updateFeature(i, e.target.value)}
                      />

                      <button type="button" onClick={() => removeFeature(i)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
            </div>

            <button
              type="submit"
              className="bg-primary text-black px-6 py-2 rounded-lg font-bold"
            >
              Save Plan
            </button>
          </form>
        </div>
      )}

      {/* LIST */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-surface-dark rounded-xl overflow-hidden border border-white/5"
          >
            <img src={plan.image_url} className="h-48 w-full object-cover" />

            <div className="p-4 flex flex-col items-start justify-start gap-2.5">
              <h3 className="font-bold">{plan.title}</h3>

              <p className="text-primary font-bold">₹{plan.price}</p>

              <div className="text-sm text-gray-400 flex flex-col gap-0.5">
                {plan.plan_features?.map((f) => (
                  <div key={f.id} className="relative pl-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9ca3af] absolute left-0 top-1/2 -translate-y-1/2" />
                    {f.feature}
                  </div>
                ))}
              </div>

              <div className="w-full flex gap-2 text-xl items-center justify-end mt-4">
                <button onClick={() => handleEdit(plan)}>
                  <HiOutlinePencilAlt />
                </button>

                <button onClick={() => handleDelete(plan?.id)}>
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagePlans;

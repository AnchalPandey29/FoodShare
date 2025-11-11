// src/pages/ShareFood.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, Upload } from "lucide-react";
import { db, auth } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const ShareFood = () => {
  const [formVisible, setFormVisible] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    quantity: "",
    price: "",
    location: "",
    time: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((i) => ({ ...i, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.imageUrl) return alert("Please provide all mandatory fields");
    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        alert("Please login to share food.");
        setLoading(false);
        return;
      }

      await addDoc(collection(db, "foods"), {
        ...form,
        price: parseFloat(form.price),
        createdAt: serverTimestamp(),
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userEmail: user.email,
        userPhoto: user.photoURL || "https://i.pravatar.cc/100",
      });

      setForm({
        title: "",
        description: "",
        quantity: "",
        price: "",
        location: "",
        time: "",
        imageUrl: "",
      });

      setFormVisible(false);
    } catch (error) {
      alert("Error while sharing food: " + error.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 py-20 px-6 flex flex-col items-center">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-gray-800 mb-12 text-center"
      >
        Share your <span className="text-yellow-500">Homemade</span> Food
      </motion.h2>

      {formVisible ? (
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 space-y-5 border border-yellow-100"
        >
          {["title", "description", "quantity", "price", "location", "time"].map(
            (item) => (
              <div key={item}>
                <label className="text-gray-700 font-medium mb-1 capitalize">
                  {item}
                </label>
                <input
                  name={item}
                  type={item === "price" ? "number" : "text"}
                  value={form[item]}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none transition"
                />
              </div>
            )
          )}

          <div>
            <label className="text-gray-700 font-medium mb-1 flex items-center gap-2">
              Image URL
            </label>
            <input
              type="url"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 outline-none transition"
            />

            {form.imageUrl && (
              <img
                src={form.imageUrl}
                alt="Preview"
                className="mt-4 rounded-xl shadow-md w-full max-h-64 object-cover"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-gray-900 font-semibold py-3 rounded-full shadow-md hover:bg-yellow-300 transition flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
            {loading ? "Uploading..." : "Share Food"}
          </button>
        </motion.form>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md"
        >
          <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">
            Food shared successfully
          </h3>
          <p className="text-gray-600 mb-6">
            Thanks for sharing! Your meal is now available for others to find.
          </p>
          <button
            onClick={() => setFormVisible(true)}
            className="bg-yellow-400 text-gray-900 font-semibold px-6 py-2 rounded-full shadow-md hover:bg-yellow-300 transition"
          >
            Share Another
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ShareFood;

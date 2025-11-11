import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Star } from "lucide-react";
import { collection, getDocs, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import FoodFilters from "../components/FoodFilters";

const FindFood = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedLocation, setSelectedLocation] = useState("");
  const navigate = useNavigate();

  // Fetch foods + average rating
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "foods"), async (snap) => {
      const foodList = await Promise.all(
        snap.docs.map(async (docSnap) => {
          const food = { id: docSnap.id, ...docSnap.data() };

          // Get uploader info
          let uploaderData = null;
          if (food.userId) {
            const uploaderRef = doc(db, "users", food.userId);
            const uploaderSnap = await getDoc(uploaderRef);
            if (uploaderSnap.exists()) uploaderData = uploaderSnap.data();
          }

          // Calculate avgRating
          const reviewsSnap = await getDocs(collection(db, "foods", docSnap.id, "reviews"));
          const reviews = reviewsSnap.docs.map((r) => r.data());
          const avgRating =
            reviews.length > 0
              ? (reviews.reduce((a, b) => a + (b.rating || 0), 0) / reviews.length).toFixed(1)
              : 0;

          return { ...food, uploader: uploaderData, avgRating, reviewCount: reviews.length };
        })
      );
      setFoods(foodList);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const locations = useMemo(() => [...new Set(foods.map((f) => f.location))], [foods]);

  const filteredFoods = useMemo(() => {
    let filtered = foods.filter(
      (f) =>
        f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (selectedLocation) filtered = filtered.filter((f) => f.location === selectedLocation);
    return filtered.sort((a, b) => (sortOrder === "asc" ? a.price - b.price : b.price - a.price));
  }, [foods, searchTerm, sortOrder, selectedLocation]);

  // Navigate to checkout with food + uploader info
  const handleBuy = (food) => {
    navigate(`/checkout/${food.id}`, { state: { food, uploader: food.uploader } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 py-20 px-6 font-sans">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-12"
      >
        Find Delicious Meals Nearby
      </motion.h2>

      <FoodFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        locations={locations}
      />

      {loading ? (
        <p className="text-center text-gray-500 animate-pulse">Loading meals...</p>
      ) : filteredFoods.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">No meals found 😔</p>
      ) : (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-10 max-w-7xl mx-auto">
          {filteredFoods.map((food, i) => (
            <motion.div
              key={food.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all overflow-hidden group"
            >
              <div className="relative">
                <img
                  src={food.imageUrl || "https://via.placeholder.com/400x300"}
                  alt={food.title}
                  className="w-full h-52 object-cover transform group-hover:scale-105 transition duration-500"
                />
                <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 text-xs font-semibold px-3 py-1 rounded-full shadow">
                  ₹{food.price}
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-xl mb-1 text-gray-800">{food.title}</h3>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={16}
                      className={`${
                        index < Math.round(food.avgRating) ? "text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">
                    ({food.avgRating} / {food.reviewCount})
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{food.description}</p>

                <div className="flex justify-between text-gray-700 text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} /> {food.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={14} /> {food.pickupTime}
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleBuy(food)}
                    className="flex-1 bg-yellow-400 text-gray-900 font-semibold py-2 rounded-full shadow-md hover:bg-yellow-300 transition"
                  >
                    Buy Now
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate(`/food/${food.id}`)}
                    className="flex-1 border border-yellow-400 text-yellow-600 font-semibold py-2 rounded-full shadow-sm hover:bg-yellow-50 transition"
                  >
                    Details
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FindFood;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  onSnapshot,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { motion } from "framer-motion";
import {
  MapPin,
  Clock,
  User,
  ShoppingBag,
  SendHorizonal,
} from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [food, setFood] = useState(null);
  const [uploader, setUploader] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [user, setUser] = useState(null);

  // Track current auth user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currUser) => {
      if (currUser) {
        const userRef = doc(db, "users", currUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) setUser(userSnap.data());
        else
          setUser({
            name: currUser.displayName || "Anonymous",
            email: currUser.email,
            photoURL: currUser.photoURL || "https://i.pravatar.cc/100",
            uid: currUser.uid,
          });
      } else setUser(null);
    });
    return () => unsubscribe();
  }, []);

  // Fetch food details and uploader info
  useEffect(() => {
    const fetchFood = async () => {
      const foodRef = doc(db, "foods", id);
      const foodSnap = await getDoc(foodRef);
      if (foodSnap.exists()) {
        const data = { id: foodSnap.id, ...foodSnap.data() };
        setFood(data);

        // Fetch uploader
        if (data.userId) {
          const uploaderRef = doc(db, "users", data.userId);
          const uploaderSnap = await getDoc(uploaderRef);
          if (uploaderSnap.exists()) setUploader(uploaderSnap.data());
        }
      }
    };
    fetchFood();
  }, [id]);

  // Real-time reviews listener
  useEffect(() => {
    const reviewsRef = collection(db, "foods", id, "reviews");
    const unsub = onSnapshot(reviewsRef, (snapshot) => {
      const revs = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      setReviews(revs);
    });
    return () => unsub();
  }, [id]);

  // Navigate to checkout page
  const handleBuyNow = () => {
    navigate(`/checkout/${id}`, { state: { food, uploader } });
  };

  // Add review
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in to add a review");
    if (!newReview.trim()) return;

    try {
      const reviewsRef = collection(db, "foods", id, "reviews");
      await addDoc(reviewsRef, {
        text: newReview,
        userName: user.name,
        userPhoto: user.photoURL || "https://i.pravatar.cc/100",
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      setNewReview("");
    } catch (err) {
      console.error("Error adding review:", err);
    }
  };

  if (!food)
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        Loading food details...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 py-12 px-6 md:px-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden"
      >
        {/* Food Image */}
        <div className="relative">
          <img
            src={food.imageUrl || "https://via.placeholder.com/600x400"}
            alt={food.name}
            className="w-full h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-6 text-white">
            <h1 className="text-3xl font-bold drop-shadow-md">{food.name}</h1>
            {food.category && (
              <p className="text-lg font-medium opacity-90">{food.category}</p>
            )}
          </div>
        </div>

        {/* Food & Uploader Info */}
        <div className="p-8 md:p-10">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={uploader?.photoURL || "https://i.pravatar.cc/100"}
              alt="Uploader"
              className="w-14 h-14 rounded-full object-cover border-2 border-yellow-400 shadow"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <User size={18} className="text-yellow-500" />
                {uploader?.name || "Anonymous User"}
              </h2>
              <p className="text-sm text-gray-500">{uploader?.email}</p>
              {food.location && (
                <p className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <MapPin size={16} className="text-yellow-500" />
                  {food.location}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed mb-6">{food.description}</p>

          {/* Expiry & Quantity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center gap-3 text-gray-600">
              <Clock size={20} className="text-yellow-500" />
              <span>
                <strong>Expiry:</strong> {food.expiryDate || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <ShoppingBag size={20} className="text-yellow-500" />
              <span>
                <strong>Quantity:</strong> {food.quantity || "1 serving"}
              </span>
            </div>
          </div>

          {/* Location Map (if available) */}
          {food.latitude && food.longitude && (
            <iframe
              title="map"
              className="w-full h-64 rounded-2xl shadow-md mb-8"
              src={`https://www.google.com/maps?q=${food.latitude},${food.longitude}&z=15&output=embed`}
              allowFullScreen
              loading="lazy"
            ></iframe>
          )}

          {/* Reviews Section */}
          <div className="mt-10">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Reviews</h3>

            {/* Add Review */}
            <form
              onSubmit={handleAddReview}
              className="flex items-center gap-3 mb-6"
            >
              <img
                src={user?.photoURL || "https://i.pravatar.cc/100"}
                alt="User"
                className="w-10 h-10 rounded-full object-cover border"
              />
              <input
                type="text"
                placeholder="Write your review..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-300 p-2 rounded-full"
              >
                <SendHorizonal size={20} />
              </button>
            </form>

            {/* Display Reviews */}
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-gray-50 border border-gray-200 p-4 rounded-xl shadow-sm flex items-start gap-3"
                  >
                    <img
                      src={rev.userPhoto || "https://i.pravatar.cc/100"}
                      alt={rev.userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{rev.userName}</p>
                      <p className="text-gray-600 text-sm mt-1">{rev.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No reviews yet. Be the first!</p>
            )}
          </div>

          {/* Request / Buy Button */}
          <div className="mt-10 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleBuyNow}
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300"
            >
              Request This Food
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default FoodDetails;

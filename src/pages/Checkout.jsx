import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const Checkout = () => {
  const { id } = useParams();
  const location = useLocation();
  const passedState = location.state || {};

  const [food, setFood] = useState(passedState.food || null);
  const [seller, setSeller] = useState(passedState.uploader || null);

  const [position, setPosition] = useState(null);
  const [buyer, setBuyer] = useState({
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
  });

  // Fetch food + seller
  useEffect(() => {
    const fetchFood = async () => {
      if (!food) {
        const docRef = doc(db, "foods", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setFood({ id: docSnap.id, ...docSnap.data() });
      }
      if (!seller && food?.userId) {
        const sellerRef = doc(db, "users", food.userId);
        const sellerSnap = await getDoc(sellerRef);
        if (sellerSnap.exists()) setSeller(sellerSnap.data());
      }
    };
    fetchFood();
  }, [id, food, seller]);

  // Reverse Geocoding
  async function reverseGeocode(lat, lng) {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`;
    const res = await fetch(url);
    const data = await res.json();
    return {
      city: data.city || data.locality || "",
      state: data.principalSubdivision || "",
      pincode: data.postcode || "",
      street: data.street || "",
    };
  }

  // Map Marker
  function LocationMarker() {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        setPosition({ lat, lng });
        const { city, state, pincode, street } = await reverseGeocode(lat, lng);
        setBuyer((prev) => ({
          ...prev,
          addressLine1: street || prev.addressLine1,
          city,
          state,
          pincode,
          latitude: lat,
          longitude: lng,
        }));
      },
    });
    return position ? <Marker position={position} icon={markerIcon} /> : null;
  }

  // Current Location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setPosition({ lat, lng });
      const { city, state, pincode, street } = await reverseGeocode(lat, lng);
      setBuyer((prev) => ({
        ...prev,
        addressLine1: street || prev.addressLine1,
        city,
        state,
        pincode,
        latitude: lat,
        longitude: lng,
      }));
    });
  };

  const handleChange = (e) => setBuyer({ ...buyer, [e.target.name]: e.target.value });

  // 🟡 Razorpay Loader
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // 🟢 Razorpay Payment Handler
  const startPayment = async (food, buyer) => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Failed to load Razorpay SDK. Please check your connection.");
      return;
    }

    const options = {
      key: "YOUR_RAZORPAY_KEY_ID", // ⚠️ Replace with your Razorpay Key ID
      amount: food.price * 100,
      currency: "INR",
      name: "Food Share",
      description: `Payment for ${food.title}`,
      image: "https://cdn-icons-png.flaticon.com/512/857/857681.png",
      handler: function (response) {
        alert("✅ Payment successful! Payment ID: " + response.razorpay_payment_id);
      },
      prefill: {
        name: buyer.name,
        email: "buyer@example.com", // optional if available
      },
      theme: {
        color: "#FBBF24",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  // Confirm Order
  const handleConfirm = async () => {
    if (!buyer.name || !buyer.addressLine1 || !buyer.city || !buyer.pincode) {
      return alert("Please fill in all required fields");
    }

    try {
      const ordersRef = collection(db, "orders");
      await addDoc(ordersRef, {
        foodId: id,
        foodTitle: food.title,
        sellerName: seller?.name || "Anonymous",
        buyerName: buyer.name,
        buyerAddress: buyer,
        createdAt: new Date(),
      });

      alert("Order placed successfully ✅");
      await startPayment(food, buyer);
    } catch (err) {
      console.error(err);
      alert("Error placing order ❌");
    }
  };

  if (!food) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-yellow-600">Checkout</h1>

      {/* Food & Seller Info */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={food.imageUrl || "https://via.placeholder.com/200"}
            alt={food.title}
            className="w-48 h-48 object-cover rounded-lg shadow"
          />
          <div>
            <h2 className="text-2xl font-semibold mb-2">{food.title}</h2>
            <p className="text-gray-700 mb-1">
              <strong>Price:</strong> ₹{food.price}
            </p>
            <p className="text-gray-700 mb-1">
              <strong>Seller:</strong> {seller?.name || "Anonymous"}
            </p>
            {seller?.location && (
              <p className="text-gray-700">
                <strong>Seller Location:</strong> {seller.location}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Buyer Details */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-yellow-600">Buyer Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["name", "addressLine1", "addressLine2", "city", "state", "pincode"].map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field.replace(/([A-Z])/g, " $1")}
              value={buyer[field]}
              onChange={handleChange}
              className="border rounded-lg p-3 w-full"
            />
          ))}
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-yellow-600">Select Delivery Location</h2>
          <button
            onClick={handleUseCurrentLocation}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
          >
            Use My Current Location
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-2">
          Tap anywhere on the map to drop your delivery pin.
        </p>
        <MapContainer
          center={[20.5937, 78.9629]}
          zoom={5}
          style={{ height: "300px", borderRadius: "12px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap"
          />
          <LocationMarker />
        </MapContainer>
      </div>

      {/* Confirm Order */}
      <div className="text-center">
        <button
          onClick={handleConfirm}
          className="bg-yellow-500 text-white px-8 py-3 rounded-lg hover:bg-yellow-600 text-lg font-semibold"
        >
          Confirm Order & Pay
        </button>
      </div>
    </div>
  );
};

export default Checkout;

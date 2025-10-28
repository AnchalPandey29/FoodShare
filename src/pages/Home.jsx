import React from "react";
import { Utensils, Share2, Heart, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const HomePage = () => {
  return (
    <div className="font-sans text-gray-800">
      {/* ---------------- HERO SECTION ---------------- */}
      <section className="relative bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/60"></div>
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Share Food, Spread Love ❤️
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-gray-200">
            Got extra homemade food? Share it with those nearby who could use a meal.
            Let’s make kindness the new flavor of our city.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <button className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded-full hover:bg-yellow-300 transition">
              Share Your Food
            </button>
            <button className="bg-transparent border border-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition">
              Find Food Near You
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* ---------------- FEATURES SECTION ---------------- */}
      <section className="py-20 bg-white text-center">
        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-4"
        >
          Why Choose FoodShare?
        </motion.h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Our platform connects caring home chefs with people who value real, homemade meals.
        </p>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto px-6">
          {[
            { icon: Utensils, title: "Homemade Goodness", desc: "Share or find food made with love by real people, not restaurants.", color: "yellow" },
            { icon: Share2, title: "Simple Sharing", desc: "Post your available food or request one nearby — it’s quick and easy.", color: "green" },
            { icon: Heart, title: "Zero Waste, Full Hearts", desc: "Together, we reduce food waste and spread love through every plate.", color: "red" },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              transition={{ delay: i * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl shadow-md hover:shadow-lg transition"
            >
              <div className={`bg-${item.color}-100 inline-flex p-4 rounded-full mb-4`}>
                <item.icon className={`text-${item.color}-600 w-8 h-8`} />
              </div>
              <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------- HOW IT WORKS SECTION ---------------- */}
      <section className="bg-yellow-50 py-20">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto px-6 text-center"
        >
          <h2 className="text-4xl font-bold mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            {["Post Your Meal", "Find Nearby Food", "Pickup & Enjoy"].map((step, i) => (
              <motion.div key={i} whileHover={{ scale: 1.05 }} className="p-6">
                <div className="w-16 h-16 bg-yellow-400 text-black rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-xl mb-2">{step}</h3>
                <p className="text-gray-600">
                  {i === 0
                    ? "Upload a photo, add details about your dish, and set the pickup time."
                    : i === 1
                    ? "Browse nearby home chefs ready to share their extra portions."
                    : "Head to the location, collect your meal, and enjoy homemade love."}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ---------------- CTA SECTION ---------------- */}
      <section className="bg-gray-900 text-white py-20 text-center">
        <motion.h2
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-4"
        >
          Start Sharing Today
        </motion.h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Every shared meal creates a connection. Let’s build a community that nourishes both hearts and stomachs.
        </p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="bg-yellow-400 text-black font-semibold px-8 py-3 rounded-full hover:bg-yellow-300 transition flex items-center gap-2 mx-auto"
        >
          Join FoodShare <ArrowRight className="w-5 h-5" />
        </motion.button>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="bg-gray-100 py-8 text-center text-gray-600 text-sm">
        <div className="flex justify-center items-center gap-2 mb-2">
          <MapPin className="w-4 h-4" />
          <span>Made with ❤️ in India</span>
        </div>
        © {new Date().getFullYear()} FoodShare. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;

import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const Contact = () => {

    const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};
  return (
    <section className="bg-gray-50 min-h-screen py-16 px-6">
      {/* Header */}
      <motion.div
        className="text-center max-w-2xl mx-auto mb-12"
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold text-green-700 mb-4">Get in Touch</h2>
        <p className="text-gray-600 text-lg">
          Have questions, feedback, or want to contribute to reducing food waste?
          We’d love to hear from you! Reach out and let’s make an impact together.
        </p>
      </motion.div>

      {/* Contact Info */}
      <motion.div
        className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-16"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        {/* Email */}
        <div className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <Mail className="mx-auto text-green-600 mb-4" size={40} />
          <h3 className="text-xl font-semibold mb-2">Email Us</h3>
          <p className="text-gray-600 mb-2">We’re just an email away!</p>
          <a
            href="mailto:support@eathealthy.com"
            className="text-green-600 font-medium hover:underline"
          >
            support@eathealthy.com
          </a>
        </div>

        {/* Phone */}
        <div className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <Phone className="mx-auto text-green-600 mb-4" size={40} />
          <h3 className="text-xl font-semibold mb-2">Call Us</h3>
          <p className="text-gray-600 mb-2">We’re happy to help!</p>
          <a
            href="tel:+919876543210"
            className="text-green-600 font-medium hover:underline"
          >
            +91 98765 43210
          </a>
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
          <MapPin className="mx-auto text-green-600 mb-4" size={40} />
          <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
          <p className="text-gray-600">
            45, Green Valley Road, Vellore, Tamil Nadu, India
          </p>
        </div>
      </motion.div>

     
        {/* Contact Form & Map */}
      <motion.div
        className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-start"
        initial="hidden"
        whileInView="visible"
        variants={fadeUp}
        viewport={{ once: true }}
      >
        {/* Form */}
        <motion.div
          className="bg-white shadow-lg rounded-2xl p-8"
          whileHover={{ scale: 1.02 }}
        >
          <h3 className="text-2xl font-semibold text-green-700 mb-6 text-center">
            Send Us a Message
          </h3>
          <form className="grid gap-5">
            {["Full Name", "Email Address"].map((label, i) => (
              <div key={i}>
                <label className="block text-gray-700 font-medium mb-2">
                  {label}
                </label>
                <input
                  type={label === "Email Address" ? "email" : "text"}
                  placeholder={`Enter your ${label.toLowerCase()}`}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            ))}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Message
              </label>
              <textarea
                rows="4"
                placeholder="Write your message..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none resize-none"
              ></textarea>
            </div>
            <div className="text-center">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200"
              >
                Send Message
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Lucknow Map */}
        <motion.div
          className="rounded-2xl overflow-hidden shadow-lg h-full"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <iframe
            title="FoodShare Lucknow Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.855779992532!2d80.9401174754165!3d26.8466935766898!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd1d9c0882b7%3A0xdeb5ad3a985833c9!2sHazratganj%2C%20Lucknow%2C%20Uttar%20Pradesh%20226001!5e0!3m2!1sen!2sin!4v1730070700000!5m2!1sen!2sin"
            width="100%"
            height="500"
            allowFullScreen=""
            loading="lazy"
            className="border-0 w-full h-[500px]"
          ></iframe>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Contact;

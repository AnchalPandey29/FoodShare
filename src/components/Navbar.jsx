import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Heart } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menu = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Find Food", path: "/find-food" },
    { label: "Share Food", path: "/share" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-sm sticky top-0 z-50 shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* ----------- Logo ----------- */}
        <Link to="/" className="flex items-center gap-2">
          <Heart className="text-yellow-500 w-7 h-7" />
          <span className="text-2xl font-bold text-gray-800">
            Food<span className="text-yellow-500">Share</span>
          </span>
        </Link>

        {/* ----------- Desktop Menu ----------- */}
        <div className="hidden md:flex items-center gap-8">
          {menu.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="text-gray-700 font-medium hover:text-yellow-500 transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}

          {/* CTA Button */}
          <Link
            to="/login"
            className="bg-yellow-400 text-black px-5 py-2 rounded-full font-semibold hover:bg-yellow-300 transition"
          >
            Login / Signup
          </Link>
        </div>

        {/* ----------- Mobile Menu Button ----------- */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* ----------- Mobile Dropdown Menu ----------- */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-inner">
          <div className="flex flex-col items-center py-4 space-y-4">
            {menu.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="text-gray-700 font-medium hover:text-yellow-500 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* CTA Button */}
            <Link
              to="/login"
              className="bg-yellow-400 text-black px-5 py-2 rounded-full font-semibold hover:bg-yellow-300 transition"
              onClick={() => setIsOpen(false)}
            >
              Login / Signup
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

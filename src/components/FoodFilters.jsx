// src/components/FoodFilters.jsx
import React from "react";
import { Search, Filter, SortAsc, SortDesc } from "lucide-react";
import { motion } from "framer-motion";

const FoodFilters = ({
  searchTerm,
  setSearchTerm,
  sortOrder,
  setSortOrder,
  selectedLocation,
  setSelectedLocation,
  locations,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-lg shadow-md rounded-2xl p-4 mb-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 border border-yellow-100"
    >
      {/* Search */}
      <div className="relative w-full md:w-1/3">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search meals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Filter by Location */}
      <div className="relative flex items-center gap-2 w-full md:w-1/3">
        <Filter className="text-gray-400" size={18} />
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="w-full border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="">All Locations</option>
          {locations.map((loc, i) => (
            <option key={i} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Sort by Price */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        className="flex items-center gap-2 bg-yellow-400 px-4 py-2 rounded-full font-medium hover:bg-yellow-300 transition"
      >
        {sortOrder === "asc" ? (
          <>
            <SortAsc size={18} /> Price: Low → High
          </>
        ) : (
          <>
            <SortDesc size={18} /> Price: High → Low
          </>
        )}
      </motion.button>
    </motion.div>
  );
};

export default FoodFilters;

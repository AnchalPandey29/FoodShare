import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Heart, LogOut, User } from "lucide-react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, updateProfile, signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// Predefined avatars
const avatars = [
  "https://cdn-icons-png.freepik.com/256/13748/13748355.png?semt=ais_white_label",
  "https://avatarfiles.alphacoders.com/376/thumb-1920-376551.png",
  "https://img.freepik.com/premium-psd/cute-3d-dog-head_380580-2186.jpg",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTH8x9MPfY-DjLX_5IKENP0HtiGO_iJW8qoqg&s",
  "https://freedesignfile.com/image/preview/8923/baby-cat-avatar-drawing-clipart.png",
  "https://img.freepik.com/premium-photo/robot-logo_1103290-100960.jpg?semt=ais_hybrid&w=740&q=80"
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const navigate = useNavigate();
  const dropdownRef = useRef();

  // Handle click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
        setEditing(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Watch auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currUser) => {
      if (currUser) {
        const userRef = doc(db, "users", currUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setUser(data);
          setName(data.name);
          setPhotoURL(data.photoURL);
        } else {
          const defaultAvatar = avatars[0];
          setUser({
            name: currUser.displayName || "Anonymous",
            email: currUser.email,
            photoURL: currUser.photoURL || defaultAvatar,
            uid: currUser.uid,
          });
          setName(currUser.displayName || "Anonymous");
          setPhotoURL(currUser.photoURL || defaultAvatar);
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Save profile updates
  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, { name, photoURL });
      await updateProfile(auth.currentUser, { displayName: name, photoURL });
      setUser({ ...user, name, photoURL });
      setEditing(false);
      setProfileOpen(false);
      alert("Profile updated ✅");
    } catch (err) {
      console.error(err);
      alert("Error updating profile ❌");
    }
  };

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setProfileOpen(false);
    navigate("/");
  };

  // Menu links
  const publicLinks = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];
  const privateLinks = [
    { label: "Find Food", path: "/find" },
    { label: "Share Food", path: "/share" },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Heart className="text-yellow-500 w-7 h-7" />
          <span className="text-2xl font-bold text-gray-800">
            Food<span className="text-yellow-500">Share</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {publicLinks.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="text-gray-700 font-medium hover:text-yellow-500 transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}

          {user &&
            privateLinks.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="text-gray-700 font-medium hover:text-yellow-500 transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}

          {!user ? (
            <Link
              to="/login"
              className="bg-yellow-400 text-black px-5 py-2 rounded-full font-semibold hover:bg-yellow-300 transition"
            >
              Login / Signup
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <div
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-full px-2 py-1 transition"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <img
                  src={photoURL}
                  alt={name}
                  className="w-10 h-10 rounded-full border-2 border-yellow-400 shadow-sm"
                />
                <span className="font-semibold">{name}</span>
              </div>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg p-4 z-50 border border-gray-200 animate-fadeIn">
                  {!editing ? (
                    <>
                      <div className="flex flex-col items-center gap-2 mb-3">
                        <img
                          src={photoURL}
                          alt={name}
                          className="w-24 h-24 rounded-full border-2 border-yellow-400 shadow-sm"
                        />
                        <h3 className="font-semibold text-lg">{name}</h3>
                        <p className="text-gray-500 text-sm">{user.email}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => setEditing(true)}
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold transition"
                        >
                          <User size={18} /> Edit Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-red-400 hover:bg-red-300 text-white font-semibold transition"
                        >
                          <LogOut size={18} /> Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="font-semibold mb-2 text-center">Edit Profile</h3>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border rounded p-2 w-full mb-3"
                        placeholder="Full Name"
                      />
                      <p className="mb-2 font-medium text-sm">Choose Avatar:</p>
                      <div className="grid grid-cols-3 gap-3 mb-3 justify-items-center">
                        {avatars.map((a) => (
                          <img
                            key={a}
                            src={a}
                            alt="avatar"
                            className={`w-16 h-16 rounded-full cursor-pointer border-4 ${
                              photoURL === a ? "border-yellow-500" : "border-gray-200"
                            }`}
                            onClick={() => setPhotoURL(a)}
                          />
                        ))}
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditing(false)}
                          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          className="px-3 py-1 rounded bg-yellow-400 hover:bg-yellow-300 text-black font-semibold"
                        >
                          Save
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-inner">
          <div className="flex flex-col items-center py-4 space-y-4">
            {publicLinks.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="text-gray-700 font-medium hover:text-yellow-500 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user &&
              privateLinks.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="text-gray-700 font-medium hover:text-yellow-500 transition-colors duration-200"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            {!user ? (
              <Link
                to="/login"
                className="bg-yellow-400 text-black px-5 py-2 rounded-full font-semibold hover:bg-yellow-300 transition"
                onClick={() => setIsOpen(false)}
              >
                Login / Signup
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <img
                  src={photoURL}
                  alt={name}
                  className="w-10 h-10 rounded-full border-2 border-yellow-400"
                />
                <span className="font-semibold">{name}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, LogIn, Mail, Lock, User, Loader2, Chrome } from "lucide-react";
import { auth, googleProvider, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ------------------ Email/Password Signup ------------------
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCred.user;

      await setDoc(doc(db, "users", user.uid), {
        name: form.name,
        email: form.email,
        uid: user.uid,
        createdAt: serverTimestamp(),
      });

      alert("Signup successful 🎉");
      setForm({ name: "", email: "", password: "" });
      setIsLogin(true);
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  // ------------------ Email/Password Login ------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      alert("Login successful ✅");
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  // ------------------ Google OAuth ------------------
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        await setDoc(ref, {
          name: user.displayName,
          email: user.email,
          uid: user.uid,
          createdAt: serverTimestamp(),
        });
      }
      alert("Google Sign-in successful 🚀");
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-3xl p-8 md:p-10 max-w-md w-full"
      >
        {/* ---------- Tabs ---------- */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-6 py-2 font-semibold transition-all duration-300 rounded-full ${
              isLogin
                ? "bg-yellow-400 text-gray-900 shadow-md"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-6 py-2 font-semibold transition-all duration-300 rounded-full ${
              !isLogin
                ? "bg-yellow-400 text-gray-900 shadow-md"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* ---------- Animated Forms ---------- */}
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleLogin}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <div className="flex items-center border border-gray-300 rounded-xl px-3">
                  <Mail size={18} className="text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-2 py-2 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Password</label>
                <div className="flex items-center border border-gray-300 rounded-xl px-3">
                  <Lock size={18} className="text-gray-400" />
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-2 py-2 outline-none"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                className="mt-4 w-full bg-yellow-400 text-gray-900 font-semibold py-2.5 rounded-xl shadow-md hover:bg-yellow-300 transition"
              >
                {loading ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  <>
                    <LogIn className="inline-block mr-2" size={18} /> Login
                  </>
                )}
              </motion.button>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="mt-3 w-full flex justify-center items-center gap-2 border border-gray-300 py-2.5 rounded-xl hover:bg-gray-50 transition font-medium text-gray-700"
              >
                <Chrome className="text-yellow-500" size={18} /> Continue with Google
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="signup"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleSignup}
              className="flex flex-col gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-600">Full Name</label>
                <div className="flex items-center border border-gray-300 rounded-xl px-3">
                  <User size={18} className="text-gray-400" />
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-2 py-2 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <div className="flex items-center border border-gray-300 rounded-xl px-3">
                  <Mail size={18} className="text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-2 py-2 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Password</label>
                <div className="flex items-center border border-gray-300 rounded-xl px-3">
                  <Lock size={18} className="text-gray-400" />
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-2 py-2 outline-none"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                className="mt-4 w-full bg-yellow-400 text-gray-900 font-semibold py-2.5 rounded-xl shadow-md hover:bg-yellow-300 transition"
              >
                {loading ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  <>
                    <UserPlus className="inline-block mr-2" size={18} /> Sign Up
                  </>
                )}
              </motion.button>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="mt-3 w-full flex justify-center items-center gap-2 border border-gray-300 py-2.5 rounded-xl hover:bg-gray-50 transition font-medium text-gray-700"
              >
                <Chrome className="text-yellow-500" size={18} /> Continue with Google
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AuthPage;

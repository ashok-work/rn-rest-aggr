
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl"
      >
        {!sent ? (
          <>
            <div className="text-center mb-10">
              <h1 className="text-3xl font-black text-gray-900 mb-2">Forgot Password?</h1>
              <p className="text-gray-400">Enter your email and we'll send a reset link</p>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-2 tracking-widest">Email Address</label>
                <input 
                  type="email" 
                  required
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-orange-500 outline-none transition"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              <button type="submit" className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-orange-700 transition">
                Send Reset Link
              </button>
              <div className="text-center">
                <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-orange-600">Back to Login</Link>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-check text-2xl"></i>
            </div>
            <h2 className="text-2xl font-black mb-2">Check your inbox</h2>
            <p className="text-gray-400 mb-8">We've sent reset instructions to <b>{email}</b></p>
            <Link to="/reset-password" title="Mock Reset" className="block text-orange-600 font-bold mb-4 underline">Proceed to Mock Reset Password Page</Link>
            <Link to="/login" className="px-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl">Back to Login</Link>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

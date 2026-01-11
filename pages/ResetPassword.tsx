
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ResetPassword: React.FC = () => {
  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === confirm) {
      alert("Password reset successfully!");
      navigate('/login');
    } else {
      alert("Passwords do not match");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl"
      >
        <h1 className="text-3xl font-black text-gray-900 mb-6 text-center">New Password</h1>
        <form onSubmit={handleReset} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-2 tracking-widest">New Password</label>
            <input 
              type="password" 
              required
              className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-orange-500 outline-none"
              value={pass}
              onChange={e => setPass(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-2 tracking-widest">Confirm Password</label>
            <input 
              type="password" 
              required
              className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-orange-500 outline-none"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black text-lg shadow-xl hover:bg-orange-700 transition">
            Update Password
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;

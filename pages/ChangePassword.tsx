
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ old: '', new: '', confirm: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Password updated successfully!");
    navigate('/account');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-black mb-8">Change Password</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-2 tracking-widest">Old Password</label>
            <input 
              type="password" 
              required
              className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-orange-500 outline-none"
              value={form.old}
              onChange={e => setForm({...form, old: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-2 tracking-widest">New Password</label>
            <input 
              type="password" 
              required
              className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-orange-500 outline-none"
              value={form.new}
              onChange={e => setForm({...form, new: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-gray-400 mb-2 tracking-widest">Confirm New Password</label>
            <input 
              type="password" 
              required
              className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-orange-500 outline-none"
              value={form.confirm}
              onChange={e => setForm({...form, confirm: e.target.value})}
            />
          </div>
          <div className="flex space-x-4">
             <button type="button" onClick={() => navigate(-1)} className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl">Cancel</button>
             <button type="submit" className="flex-1 py-4 bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-200">Save</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ChangePassword;

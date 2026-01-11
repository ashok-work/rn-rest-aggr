
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addAddress, updateAddress, deleteAddress } from '../store/slices/addressSlice';
import { Address } from '../types';

const Addresses: React.FC = () => {
  const dispatch = useAppDispatch();
  const addresses = useAppSelector((state) => state.addresses.addresses);
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    label: 'Home',
    fullAddress: '',
    phone: '',
    isDefault: false
  });

  const handleOpenEdit = (addr: Address) => {
    setEditingId(addr.id);
    setFormData({
      label: addr.label,
      fullAddress: addr.fullAddress,
      phone: addr.phone,
      isDefault: addr.isDefault || false
    });
  };

  const handleSave = () => {
    if (!formData.fullAddress || !formData.phone) {
      alert("Please fill in all fields");
      return;
    }

    if (editingId) {
      dispatch(updateAddress({ id: editingId, data: formData }));
      setEditingId(null);
    } else {
      dispatch(addAddress(formData));
      setIsAdding(false);
    }
    
    setFormData({ label: 'Home', fullAddress: '', phone: '', isDefault: false });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-10 py-12">
      <div className="flex items-center justify-between mb-10">
        <button onClick={() => navigate('/account')} className="text-gray-400 hover:text-orange-600 transition-colors">
          <i className="fas fa-arrow-left mr-2"></i> Back
        </button>
        <h1 className="text-2xl font-black">My Addresses</h1>
        <button 
          onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ label: 'Home', fullAddress: '', phone: '', isDefault: false }); }}
          className="bg-orange-600 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:bg-orange-700 transition"
        >
          <i className="fas fa-plus"></i>
        </button>
      </div>

      <div className="space-y-6">
        {addresses.map((addr) => (
          <motion.div 
            key={addr.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-start justify-between group"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-orange-600">
                <i className={`fas ${addr.label.toLowerCase() === 'home' ? 'fa-home' : addr.label.toLowerCase() === 'work' ? 'fa-briefcase' : 'fa-map-marker-alt'}`}></i>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-bold text-gray-900">{addr.label}</h3>
                  {addr.isDefault && <span className="text-[10px] font-black uppercase text-green-600 bg-green-50 px-2 py-0.5 rounded">Default</span>}
                </div>
                <p className="text-sm text-gray-600 mb-1">{addr.fullAddress}</p>
                <p className="text-xs text-gray-400 font-medium">{addr.phone}</p>
              </div>
            </div>
            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => handleOpenEdit(addr)} className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition">
                <i className="fas fa-edit text-xs"></i>
              </button>
              <button onClick={() => dispatch(deleteAddress(addr.id))} className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-600 transition">
                <i className="fas fa-trash text-xs"></i>
              </button>
            </div>
          </motion.div>
        ))}

        {addresses.length === 0 && (
          <div className="text-center py-10 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400">No saved addresses.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {(isAdding || editingId) && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setIsAdding(false); setEditingId(null); }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
              <h2 className="text-xl font-black mb-6">{editingId ? 'Edit Address' : 'New Address'}</h2>
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-2 tracking-widest">Label</label>
                  <div className="flex space-x-2">
                    {['Home', 'Work', 'Other'].map(l => (
                      <button 
                        key={l}
                        onClick={() => setFormData({ ...formData, label: l })}
                        className={`flex-1 py-3 rounded-xl border-2 font-bold text-sm transition ${formData.label === l ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-50 bg-gray-50 text-gray-500'}`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-2 tracking-widest">Full Address</label>
                  <textarea 
                    className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-orange-500 outline-none text-gray-700 h-24"
                    placeholder="Enter street, apartment, city..."
                    value={formData.fullAddress}
                    onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-2 tracking-widest">Phone Number</label>
                  <input 
                    type="tel"
                    className="w-full px-5 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="+1 234 567 890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <input 
                    type="checkbox" 
                    id="default-check"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="w-5 h-5 accent-orange-600 rounded"
                  />
                  <label htmlFor="default-check" className="text-sm font-bold text-gray-700">Set as default address</label>
                </div>
              </div>
              <div className="flex space-x-4">
                 <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl">Cancel</button>
                 <button onClick={handleSave} className="flex-1 py-4 bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-200">Save Address</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Addresses;


import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { generateTasteProfile } from '../services/geminiService';

const Account: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const orders = useAppSelector((state) => state.orders.orders);
  const [tasteProfile, setTasteProfile] = useState<string>('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  useEffect(() => {
    const fetchTaste = async () => {
      const allItemNames = orders.flatMap(o => o.items.map(i => i.name));
      if (allItemNames.length > 0) {
        setIsLoadingProfile(true);
        const profile = await generateTasteProfile(allItemNames);
        setTasteProfile(profile);
        setIsLoadingProfile(false);
      }
    };
    fetchTaste();
  }, [orders]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="max-w-xl mx-auto px-4 md:px-10 py-12">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="p-12 text-center bg-gradient-to-b from-orange-50/50 to-white">
          <motion.img 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            src={user?.avatar} 
            className="w-28 h-28 rounded-[2rem] border-4 border-white shadow-2xl mx-auto mb-6" 
          />
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">{user?.name}</h1>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">{user?.email}</p>
        </div>

        {/* AI Taste Profile Section */}
        <div className="px-10 mb-8">
           <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="bg-gradient-to-br from-orange-600 to-red-600 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <i className="fas fa-utensils text-[6rem]"></i>
              </div>
              <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-4">
                   <div className="w-6 h-6 bg-white/20 backdrop-blur rounded flex items-center justify-center">
                      <i className="fas fa-sparkles text-[10px]"></i>
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-200">Personalized Taste Profile</span>
                </div>
                
                {isLoadingProfile ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-6 bg-white/10 rounded-full w-3/4"></div>
                    <div className="h-4 bg-white/10 rounded-full w-full"></div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xl font-black mb-2 leading-tight">
                      {tasteProfile.split(':')[0] || "Discovering your taste..."}
                    </h3>
                    <p className="text-sm text-orange-50 font-medium leading-relaxed italic opacity-90">
                      "{tasteProfile.split(':')[1]?.trim() || "Order more to let AI define your culinary personality."}"
                    </p>
                  </div>
                )}
              </div>
           </motion.div>
        </div>

        <div className="px-8 pb-10 space-y-3">
           <Link to="/orders" className="flex items-center justify-between p-6 hover:bg-gray-50 rounded-[2rem] transition-all group border border-transparent hover:border-gray-100">
              <div className="flex items-center space-x-5">
                 <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-[1.2rem] flex items-center justify-center text-lg">
                    <i className="fas fa-shopping-bag"></i>
                 </div>
                 <span className="font-black text-gray-700 tracking-tight">Order History</span>
              </div>
              <i className="fas fa-chevron-right text-gray-300 group-hover:text-orange-600 group-hover:translate-x-1 transition-all"></i>
           </Link>

           <Link to="/change-password" title="Change Password" className="flex items-center justify-between p-6 hover:bg-gray-50 rounded-[2rem] transition-all group border border-transparent hover:border-gray-100">
              <div className="flex items-center space-x-5">
                 <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-[1.2rem] flex items-center justify-center text-lg">
                    <i className="fas fa-lock"></i>
                 </div>
                 <span className="font-black text-gray-700 tracking-tight">Security & Privacy</span>
              </div>
              <i className="fas fa-chevron-right text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"></i>
           </Link>

           <Link to="/addresses" className="flex items-center justify-between p-6 hover:bg-gray-50 rounded-[2rem] transition-all group border border-transparent hover:border-gray-100">
              <div className="flex items-center space-x-5">
                 <div className="w-12 h-12 bg-green-50 text-green-600 rounded-[1.2rem] flex items-center justify-center text-lg">
                    <i className="fas fa-map-marker-alt"></i>
                 </div>
                 <span className="font-black text-gray-700 tracking-tight">Delivery Addresses</span>
              </div>
              <i className="fas fa-chevron-right text-gray-300 group-hover:text-green-600 group-hover:translate-x-1 transition-all"></i>
           </Link>
           
           <button onClick={handleLogout} className="w-full flex items-center justify-between p-6 hover:bg-red-50 rounded-[2rem] transition-all group border border-transparent hover:border-red-100 text-red-600">
              <div className="flex items-center space-x-5">
                 <div className="w-12 h-12 bg-red-50 text-red-600 rounded-[1.2rem] flex items-center justify-center text-lg">
                    <i className="fas fa-sign-out-alt"></i>
                 </div>
                 <span className="font-black tracking-tight text-lg">Logout</span>
              </div>
           </button>
        </div>
        
        <div className="p-10 text-center border-t border-gray-50 bg-gray-50/30">
          <p className="text-[10px] text-gray-300 font-black tracking-[0.3em] uppercase">BiteDash Ultimate Edition</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Account;

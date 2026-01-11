
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addOrder } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';
import { MOCK_RESTAURANTS } from '../constants';
import { Address } from '../types';
import { suggestOrderNotes } from '../services/geminiService';

const Checkout: React.FC = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const addresses = useAppSelector((state) => state.addresses.addresses);
  const navigate = useNavigate();
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(addresses.find(a => a.isDefault) || addresses[0] || null);
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (cartItems.length > 0) {
      const fetchSuggestions = async () => {
        const dishNames = cartItems.map(i => i.name);
        const suggestions = await suggestOrderNotes(dishNames);
        setAiSuggestions(suggestions);
      };
      fetchSuggestions();
    }
  }, [cartItems]);

  if (cartItems.length === 0) {
    navigate('/');
    return null;
  }

  const restaurantId = cartItems[0].restaurantId;
  const restaurant = MOCK_RESTAURANTS.find(r => r.id === restaurantId);
  const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = 2.99;
  const platformFee = 0.99;
  const finalTotal = total + deliveryFee + platformFee;

  const handleOrder = () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      dispatch(addOrder({
        items: cartItems,
        total: finalTotal,
        restaurantName: restaurant?.name || 'Restaurant',
        paymentMethod,
        note
      }));
      dispatch(clearCart());
      setIsProcessing(false);
      navigate('/orders');
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-10 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <i className="fas fa-map-marker-alt text-orange-600 mr-3"></i>
              Delivery Address
            </h2>
            {selectedAddress ? (
              <div className="flex items-start justify-between p-6 border-2 border-orange-500 bg-orange-50 rounded-2xl">
                <div>
                  <p className="font-bold text-gray-900">{selectedAddress.label}</p>
                  <p className="text-sm text-gray-600 mt-1">{selectedAddress.fullAddress}</p>
                  <p className="text-xs text-gray-400 mt-2">{selectedAddress.phone}</p>
                </div>
                <button onClick={() => setShowAddressPicker(true)} className="text-orange-600 font-bold text-sm">Change</button>
              </div>
            ) : (
              <button onClick={() => navigate('/addresses')} className="w-full p-6 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold hover:border-orange-500 hover:text-orange-600 transition">
                + Add Address to continue
              </button>
            )}
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center">
              <i className="fas fa-credit-card text-orange-600 mr-3"></i>
              Payment Method
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['Credit Card', 'Cash on Delivery', 'UPI / Wallet'].map(method => (
                <button 
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`p-4 rounded-2xl border-2 text-sm font-bold transition-all ${paymentMethod === method ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-100 bg-gray-50 text-gray-500'}`}
                >
                  <i className={`fas ${method === 'Credit Card' ? 'fa-credit-card' : method === 'Cash on Delivery' ? 'fa-money-bill' : 'fa-wallet'} block mb-2 text-lg`}></i>
                  {method}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <i className="fas fa-sticky-note text-orange-600 mr-3"></i>
                Order Note
              </h2>
              {aiSuggestions.length > 0 && (
                <div className="flex items-center space-x-2">
                  <i className="fas fa-sparkles text-orange-400 text-xs"></i>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Smart Picks</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {aiSuggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => setNote(prev => prev ? `${prev}, ${suggestion}` : suggestion)}
                  className="px-3 py-1.5 bg-orange-50 text-orange-600 text-xs font-bold rounded-lg border border-orange-100 hover:bg-orange-100 transition active:scale-95"
                >
                  + {suggestion}
                </button>
              ))}
            </div>

            <textarea 
              placeholder="e.g. Leave at the door, extra spice, no onions..."
              className="w-full h-32 p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-orange-500 outline-none text-gray-700"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </motion.div>
        </div>

        <div className="space-y-8">
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="flex items-center space-x-4 mb-6 pb-6 border-b">
               <img src={restaurant?.image} className="w-16 h-16 rounded-xl object-cover" />
               <div>
                  <h4 className="font-bold">{restaurant?.name}</h4>
                  <p className="text-xs text-gray-400">{cartItems.length} items</p>
               </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-bold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery Fee</span>
                <span className="font-bold">${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Service Fee</span>
                <span className="font-bold">${platformFee.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t flex justify-between">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-black text-orange-600">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleOrder}
              disabled={isProcessing || !selectedAddress}
              className={`w-full py-4 bg-orange-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-orange-200 hover:bg-orange-700 transition active:scale-95 ${isProcessing || !selectedAddress ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <i className="fas fa-circle-notch fa-spin mr-2"></i>
                  Processing...
                </div>
              ) : 'Confirm Order'}
            </button>
            <p className="text-center text-[10px] text-gray-400 mt-4 uppercase font-bold tracking-widest">
              Secured by BiteDash Pay
            </p>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showAddressPicker && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddressPicker(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
              <h2 className="text-xl font-black mb-6">Select Address</h2>
              <div className="space-y-4 mb-8 max-h-80 overflow-y-auto no-scrollbar">
                {addresses.map(addr => (
                  <button 
                    key={addr.id}
                    onClick={() => { setSelectedAddress(addr); setShowAddressPicker(false); }}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition ${selectedAddress?.id === addr.id ? 'border-orange-500 bg-orange-50' : 'border-gray-50 bg-gray-50'}`}
                  >
                    <p className="font-bold text-gray-900">{addr.label}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{addr.fullAddress}</p>
                  </button>
                ))}
                <button 
                  onClick={() => navigate('/addresses')}
                  className="w-full p-4 rounded-2xl border-2 border-dashed border-gray-200 text-orange-600 font-bold text-sm hover:border-orange-500 transition text-center"
                >
                  + Add New Address
                </button>
              </div>
              <button onClick={() => setShowAddressPicker(false)} className="w-full py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl">Close</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Checkout;

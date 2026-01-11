
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateQuantity, removeFromCart } from '../store/slices/cartSlice';
import { useNavigate, useLocation } from 'react-router-dom';

const CartFAB: React.FC = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0 || location.pathname === '/checkout' || location.pathname === '/login') return null;

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: '100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Your Basket</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.map(item => (
                <div key={item.id} className="flex space-x-4">
                  <img src={item.image} className="w-20 h-20 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
                    <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center border rounded-lg bg-gray-50">
                        <button onClick={() => dispatch(updateQuantity({id: item.id, delta: -1}))} className="px-3 py-1 text-orange-600">-</button>
                        <span className="px-2 text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => dispatch(updateQuantity({id: item.id, delta: 1}))} className="px-3 py-1 text-orange-600">+</button>
                      </div>
                      <button onClick={() => dispatch(removeFromCart(item.id))} className="text-xs text-red-500 font-medium">Remove</button>
                    </div>
                  </div>
                  <div className="font-bold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-500 font-medium">Subtotal</span>
                <span className="text-2xl font-bold">${total.toFixed(2)}</span>
              </div>
              <button 
                onClick={() => { setIsOpen(false); navigate('/checkout'); }}
                className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-200"
              >
                Go to Checkout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 md:bottom-10 right-6 z-40 flex items-center space-x-3 bg-orange-600 text-white px-6 py-4 rounded-full shadow-2xl shadow-orange-500/30"
      >
        <div className="relative">
          <i className="fas fa-shopping-basket text-xl"></i>
          <span className="absolute -top-2 -right-2 bg-white text-orange-600 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-orange-600">
            {cartItems.reduce((s, i) => s + i.quantity, 0)}
          </span>
        </div>
        <span className="font-bold hidden sm:inline">Basket • ${total.toFixed(2)}</span>
      </motion.button>
    </>
  );
};

export default CartFAB;

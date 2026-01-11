
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { cancelOrder, updateOrderStatus } from '../store/slices/orderSlice';
import { addToCart } from '../store/slices/cartSlice';
import { OrderStatus } from '../types';
import { CANCEL_REASONS } from '../constants';

const OrderDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orders);
  const cartItems = useAppSelector((state) => state.cart.items);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [reason, setReason] = useState('');

  const order = orders.find(o => o.id === id);

  if (!order) return <div className="p-20 text-center font-bold text-gray-400">Order not found.</div>;

  const handleCancel = () => {
    if (!reason) return alert("Please select a reason");
    dispatch(cancelOrder({ id: order.id, reason }));
    setShowCancelModal(false);
  };

  const handleReorder = () => {
    if (order.items.length === 0) return;
    
    const restaurantId = order.items[0].restaurantId;
    
    // Check if current cart has items from another restaurant
    if (cartItems.length > 0 && cartItems[0].restaurantId !== restaurantId) {
      if (!confirm("Your cart contains items from another restaurant. Clear cart and add these items instead?")) {
        return;
      }
    }

    order.items.forEach(item => {
      // Re-add each item. Quantity from previous order is used.
      // The addToCart reducer handles duplicates and existing items.
      for(let i = 0; i < item.quantity; i++) {
        dispatch(addToCart({ dish: item, restaurantId }));
      }
    });

    navigate('/'); // Go home to see the FAB or go straight to checkout
    // Alternatively, we could navigate to checkout if that's the preferred UX
  };

  const statusSteps = [
    { status: OrderStatus.PENDING, label: 'Pending', icon: 'fa-clock' },
    { status: OrderStatus.PREPARING, label: 'Preparing', icon: 'fa-fire-burner' },
    { status: OrderStatus.OUT_FOR_DELIVERY, label: 'Shipping', icon: 'fa-motorcycle' },
    { status: OrderStatus.DELIVERED, label: 'Arrived', icon: 'fa-check-double' }
  ];

  const currentStatusIndex = statusSteps.findIndex(s => s.status === order.status);
  const isCancelled = order.status === OrderStatus.CANCELLED;
  const isDelivered = order.status === OrderStatus.DELIVERED;

  // Simulator helper
  const advanceStatus = () => {
    if (currentStatusIndex < statusSteps.length - 1) {
      const nextStatus = statusSteps[currentStatusIndex + 1].status;
      dispatch(updateOrderStatus({ id: order.id, status: nextStatus }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-10 py-10">
      {/* Simulation Helper Button */}
      <div className="fixed bottom-10 left-10 z-50">
        <button 
          onClick={advanceStatus}
          disabled={isCancelled || order.status === OrderStatus.DELIVERED}
          className="bg-gray-900 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl hover:bg-orange-600 transition-all active:scale-95 disabled:opacity-0 disabled:pointer-events-none"
        >
          <i className="fas fa-flask mr-2"></i> Simulate Next Step
        </button>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-orange-600 transition-colors flex items-center font-bold text-sm">
          <i className="fas fa-arrow-left mr-2"></i> Back to Orders
        </button>
        <div className="flex items-center space-x-3">
          {isDelivered && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReorder}
              className="bg-orange-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-200"
            >
              <i className="fas fa-redo mr-2"></i> Reorder All
            </motion.button>
          )}
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
            order.status === OrderStatus.CANCELLED ? 'bg-red-50 text-red-600' : 
            order.status === OrderStatus.DELIVERED ? 'bg-green-50 text-green-600' :
            'bg-orange-50 text-orange-600'
          }`}>
            {order.status}
          </div>
        </div>
      </div>

      {/* Dynamic Animated Progress Tracker */}
      {!isCancelled && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-gray-200/50 border border-gray-100 mb-8 overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent"></div>
          
          <div className="relative flex justify-between items-start">
            {/* Base Connector Line */}
            <div className="absolute top-6 left-0 right-0 h-1.5 bg-gray-100 rounded-full z-0 mx-8"></div>
            
            {/* Animated Progress Fill Line */}
            <motion.div 
              initial={false}
              animate={{ 
                width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` 
              }}
              transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
              className="absolute top-6 left-0 h-1.5 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full z-0 mx-8 origin-left shadow-[0_0_15px_rgba(249,115,22,0.4)]"
            ></motion.div>

            {statusSteps.map((step, idx) => {
              const isActive = idx <= currentStatusIndex;
              const isCurrent = idx === currentStatusIndex;
              const isCompleted = idx < currentStatusIndex;
              
              return (
                <div key={step.status} className="relative z-10 flex flex-col items-center">
                  <motion.div 
                    initial={false}
                    animate={{ 
                      backgroundColor: isActive ? '#f97316' : '#ffffff',
                      scale: isCurrent ? 1.25 : 1,
                      color: isActive ? '#ffffff' : '#cbd5e1',
                      borderColor: isActive ? '#f97316' : '#f1f5f9',
                      boxShadow: isCurrent ? '0 10px 25px -5px rgba(249, 115, 22, 0.5)' : 'none'
                    }}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg border-4 transition-shadow`}
                  >
                    <AnimatePresence mode="wait">
                      <motion.i 
                        key={isCompleted ? 'check' : 'icon'}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className={`fas ${isCompleted ? 'fa-check' : step.icon}`}
                      ></motion.i>
                    </AnimatePresence>
                  </motion.div>
                  
                  <motion.div 
                    initial={false}
                    animate={{ 
                      y: isCurrent ? 4 : 0,
                      opacity: isActive ? 1 : 0.4
                    }}
                    className="mt-4 flex flex-col items-center"
                  >
                    <span className={`text-[10px] font-black uppercase tracking-widest text-center ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                      {step.label}
                    </span>
                    {isCurrent && (
                      <motion.span 
                        layoutId="active-dot"
                        className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5"
                      />
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Delivery Message */}
          <div className="mt-10 pt-8 border-t border-gray-50 flex items-center justify-between">
             <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
                  <i className="fas fa-info-circle"></i>
                </div>
                <div>
                   <p className="text-xs font-bold text-gray-900">
                     {order.status === OrderStatus.DELIVERED 
                       ? "Order complete! Hope you enjoyed your meal." 
                       : order.status === OrderStatus.OUT_FOR_DELIVERY 
                       ? "The driver is nearby! Head to the door." 
                       : "We're currently processing your delicious order."}
                   </p>
                   <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Estimated arrival: 15-20 mins</p>
                </div>
             </div>
             {order.status !== OrderStatus.DELIVERED && (
               <div className="flex -space-x-2">
                 {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=staff${i}`} alt="staff" />
                    </div>
                 ))}
               </div>
             )}
          </div>
        </motion.div>
      )}

      {isCancelled && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-2 border-red-100 rounded-[2.5rem] p-10 mb-8 text-center"
        >
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-red-200/50">
            <i className="fas fa-ban text-3xl"></i>
          </div>
          <h2 className="text-2xl font-black text-red-900 mb-2">Order Cancelled</h2>
          <p className="text-red-700 font-medium max-w-sm mx-auto">This order was cancelled. If this was a mistake, please contact support.</p>
        </motion.div>
      )}

      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-gray-200/30 border border-gray-50 overflow-hidden mb-8">
        <div className="p-10 bg-gray-50/50 border-b flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-xs font-black text-orange-600 bg-orange-100 px-3 py-1 rounded-full uppercase tracking-widest">Receipt</span>
              <h1 className="text-2xl font-black text-gray-900">#{order.id.split('-')[1]}</h1>
            </div>
            <p className="text-sm text-gray-400 font-medium">Placed on {new Date(order.date).toLocaleString('en-US', { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <div className="text-right">
             <div className="text-3xl font-black text-gray-900">${order.total.toFixed(2)}</div>
             <div className="flex items-center justify-end space-x-2 mt-1">
               <i className="fas fa-credit-card text-gray-300 text-xs"></i>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{order.paymentMethod}</p>
             </div>
          </div>
        </div>

        <div className="p-10 space-y-10">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-gray-900 flex items-center">
                <div className="w-1.5 h-6 bg-orange-500 rounded-full mr-3"></div>
                Items Ordered
              </h3>
              <Link to={`/restaurant/${order.items[0]?.restaurantId || '1'}`} className="text-xs font-black text-orange-600 hover:text-orange-700 uppercase tracking-widest">
                View Restaurant
              </Link>
            </div>
            <div className="space-y-6">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between items-center group">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img src={item.image} className="w-14 h-14 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform" alt={item.name} />
                      <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white">
                        {item.quantity}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-900 font-black block">{item.name}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">${item.price.toFixed(2)} each</span>
                    </div>
                  </div>
                  <span className="font-black text-gray-900 text-lg">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-50">
            {order.note && (
              <div className="p-6 bg-gray-50 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2">
                  <i className="fas fa-quote-right text-gray-200 text-2xl"></i>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase mb-3 tracking-widest flex items-center">
                  <i className="fas fa-sticky-note mr-2"></i> Your Instruction
                </p>
                <p className="text-sm text-gray-600 leading-relaxed font-medium italic">"{order.note}"</p>
              </div>
            )}

            {order.cancelReason && (
               <div className="p-6 bg-red-50 rounded-3xl">
                <p className="text-[10px] font-black text-red-400 uppercase mb-3 tracking-widest flex items-center">
                  <i className="fas fa-info-circle mr-2"></i> Reason for Cancellation
                </p>
                <p className="text-sm text-red-900 leading-relaxed font-bold">{order.cancelReason}</p>
              </div>
            )}
          </div>
        </div>

        {(order.status === OrderStatus.PENDING || order.status === OrderStatus.PREPARING) && (
          <div className="px-10 pb-10">
            <button 
              onClick={() => setShowCancelModal(true)}
              className="w-full py-5 text-red-600 font-black text-xs uppercase tracking-[0.2em] bg-red-50/50 hover:bg-red-50 rounded-[1.5rem] transition-all border border-red-100 active:scale-[0.98]"
            >
              Cancel Order
            </button>
          </div>
        )}

        {isDelivered && (
          <div className="px-10 pb-10">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReorder}
              className="w-full py-5 bg-orange-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-orange-100 transition-all flex items-center justify-center space-x-3"
            >
              <i className="fas fa-redo"></i>
              <span>Reorder Everything</span>
            </motion.button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCancelModal(false)} className="absolute inset-0 bg-black/70 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-question text-2xl"></i>
                </div>
                <h2 className="text-2xl font-black text-gray-900">Cancel Order?</h2>
                <p className="text-gray-400 mt-2 font-medium">Please tell us why you're cancelling. This helps us improve our service.</p>
              </div>
              <div className="space-y-3 mb-8">
                {CANCEL_REASONS.map(r => (
                  <button 
                    key={r}
                    onClick={() => setReason(r)}
                    className={`w-full text-left p-4 rounded-2xl border-2 font-bold transition-all duration-300 flex items-center justify-between ${reason === r ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200 hover:text-gray-600'}`}
                  >
                    <span className="text-sm">{r}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${reason === r ? 'border-orange-500 bg-orange-500' : 'border-gray-200 bg-white'}`}>
                      {reason === r && <i className="fas fa-check text-white text-[10px]"></i>}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex space-x-4">
                 <button onClick={() => setShowCancelModal(false)} className="flex-1 py-4 bg-gray-100 text-gray-700 font-black text-xs uppercase tracking-widest rounded-2xl active:scale-95 transition">Keep Order</button>
                 <button onClick={handleCancel} className="flex-1 py-4 bg-red-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-red-200 hover:bg-red-700 active:scale-95 transition">Confirm Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OrderDetails;

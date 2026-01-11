
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppSelector } from '../store/hooks';
import { OrderStatus } from '../types';

const Orders: React.FC = () => {
  const orders = useAppSelector((state) => state.orders.orders);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-10 py-10">
      <h1 className="text-3xl font-black mb-10 flex items-center">
        <i className="fas fa-receipt text-orange-600 mr-4"></i>
        Order History
      </h1>

      {orders.length === 0 ? (
        <div className="bg-white p-20 rounded-3xl text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
             <i className="fas fa-utensils text-3xl"></i>
          </div>
          <h2 className="text-xl font-bold mb-2">No orders yet</h2>
          <p className="text-gray-400 mb-8">Hungry? Explore restaurants near you!</p>
          <Link to="/" className="px-8 py-3 bg-orange-600 text-white font-bold rounded-2xl">Start Ordering</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, idx) => (
            <motion.div 
              key={order.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-orange-500">
                    <i className="fas fa-store text-2xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{order.restaurantName}</h3>
                    <p className="text-sm text-gray-400">{new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {order.items.length} items</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                  <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                    order.status === OrderStatus.CANCELLED ? 'bg-red-50 text-red-600' : 
                    order.status === OrderStatus.DELIVERED ? 'bg-green-50 text-green-600' :
                    'bg-orange-50 text-orange-600'
                  }`}>
                    {order.status}
                  </div>
                  <div className="text-lg font-black">${order.total.toFixed(2)}</div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t flex space-x-3">
                <Link to={`/order/${order.id}`} className="flex-1 text-center py-2.5 bg-gray-50 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-100 transition">
                  Details
                </Link>
                {order.status === OrderStatus.DELIVERED && (
                   <button className="flex-1 text-center py-2.5 bg-orange-600 text-white text-sm font-bold rounded-xl hover:bg-orange-700 transition">
                    Reorder
                   </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;

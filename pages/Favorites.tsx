
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { MOCK_RESTAURANTS } from '../constants';
import FavoriteButton from '../components/FavoriteButton';

const StarRating: React.FC<{ rating: number }> = ({ rating }) => {
  return (
    <div className="flex items-center space-x-0.5">
      <i className="fas fa-star text-orange-500 text-[10px]"></i>
      <span className="ml-1 text-[10px] font-black text-gray-900">{rating.toFixed(1)}</span>
    </div>
  );
};

const Favorites: React.FC = () => {
  const favoriteIds = useAppSelector((state) => state.favorites.favoriteIds);
  const favoriteRestaurants = MOCK_RESTAURANTS.filter(r => favoriteIds.includes(r.id));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 py-10">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-black text-gray-900 flex items-center">
          <i className="fas fa-heart text-red-500 mr-4"></i>
          My Favorites
        </h1>
        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
          {favoriteRestaurants.length} saved
        </div>
      </div>

      {favoriteRestaurants.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-32 bg-white rounded-[3rem] shadow-sm border-2 border-dashed border-gray-100"
        >
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-200">
            <i className="far fa-heart text-4xl"></i>
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">No favorites yet</h3>
          <p className="text-gray-400 max-w-sm mx-auto font-medium">
            Save restaurants you love by tapping the heart icon on their profile.
          </p>
          <Link 
            to="/"
            className="mt-8 inline-block px-8 py-3 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 transition shadow-lg shadow-orange-200"
          >
            Explore Restaurants
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {favoriteRestaurants.map((restaurant, idx) => (
            <motion.div
              key={restaurant.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="group"
            >
              <Link to={`/restaurant/${restaurant.id}`} className="block">
                <div className="relative aspect-[16/11] rounded-[2.5rem] overflow-hidden mb-5 shadow-lg group-hover:shadow-2xl transition-all">
                  <img src={restaurant.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  
                  <div className="absolute top-5 left-5 z-20">
                    <FavoriteButton restaurantId={restaurant.id} />
                  </div>

                  <div className="absolute top-5 right-5 bg-white/95 px-3 py-2 rounded-2xl shadow-xl">
                    <StarRating rating={restaurant.rating} />
                  </div>
                </div>
                <h3 className="text-xl font-black text-gray-900 group-hover:text-orange-600 transition-colors">
                  {restaurant.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{restaurant.cuisine}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;

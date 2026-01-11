
import React from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleFavorite } from '../store/slices/favoriteSlice';

interface FavoriteButtonProps {
  restaurantId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ restaurantId, className = '', size = 'md' }) => {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector((state) => state.favorites.favoriteIds);
  const isFavorite = favoriteIds.includes(restaurantId);

  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(restaurantId));
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9, rotate: -10 }}
      onClick={handleToggle}
      className={`${sizes[size]} rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
        isFavorite 
          ? 'bg-red-500 text-white shadow-red-200' 
          : 'bg-white/90 backdrop-blur-md text-gray-400 hover:text-red-500 shadow-gray-200/50 border border-white/50'
      } ${className}`}
    >
      <i className={`${isFavorite ? 'fas' : 'far'} fa-heart`}></i>
    </motion.button>
  );
};

export default FavoriteButton;

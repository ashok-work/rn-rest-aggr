
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withSpring, withSequence, useSharedValue } from 'react-native-reanimated';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleFavorite } from '../store/slices/favoriteSlice';

interface FavoriteButtonProps {
  restaurantId: string;
  size?: 'sm' | 'md' | 'lg';
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ restaurantId, size = 'md' }) => {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector((state) => state.favorites.favoriteIds);
  const isFavorite = favoriteIds.includes(restaurantId);
  const scale = useSharedValue(1);

  const handleToggle = () => {
    scale.value = withSequence(withSpring(1.3), withSpring(1));
    dispatch(toggleFavorite(restaurantId));
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const iconSize = size === 'sm' ? 14 : size === 'md' ? 18 : 22;
  const btnSize = size === 'sm' ? 36 : size === 'md' ? 48 : 60;

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity 
        onPress={handleToggle}
        style={[
          styles.button, 
          { width: btnSize, height: btnSize, borderRadius: btnSize / 2.5 },
          isFavorite ? styles.active : styles.inactive
        ]}
      >
        <FontAwesome6 
          name="heart" 
          solid={isFavorite} 
          size={iconSize} 
          color={isFavorite ? 'white' : '#9CA3AF'} 
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: { justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
  active: { backgroundColor: '#EF4444' },
  inactive: { backgroundColor: 'white', borderWidth: 1, borderColor: '#F3F4F6' }
});

export default FavoriteButton;

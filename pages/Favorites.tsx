import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useAppSelector } from '../store/hooks';
import { MOCK_RESTAURANTS } from '../constants';
import FavoriteButton from '../components/FavoriteButton';

const { width } = Dimensions.get('window');

const StarRating = ({ rating }: { rating: number }) => (
  <View style={styles.ratingBox}>
    <FontAwesome6 name="star" size={10} color="#F97316" />
    <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
  </View>
);

const Favorites = () => {
  const navigation = useNavigation<any>();
  const favoriteIds = useAppSelector((state) => state.favorites.favoriteIds);
  const favoriteRestaurants = MOCK_RESTAURANTS.filter(r => favoriteIds.includes(r.id));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <FontAwesome6 name="arrow-left" size={18} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorites</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{favoriteRestaurants.length}</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={true}
      >
        {favoriteRestaurants.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <FontAwesome6 name="heart" size={40} color="#FEE2E2" />
            </View>
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptySubtitle}>Tap the heart icon on any restaurant to save it here for later.</Text>
            <TouchableOpacity 
              style={styles.exploreBtn}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.exploreBtnText}>Explore Restaurants</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.grid}>
            {favoriteRestaurants.map((restaurant, idx) => (
              <Animated.View 
                key={restaurant.id}
                entering={FadeInUp.delay(idx * 100)}
                style={styles.cardWrapper}
              >
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Menu', { id: restaurant.id })}
                >
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: restaurant.image }} style={styles.image} />
                    <View style={styles.favBtnWrapper}>
                      <FavoriteButton restaurantId={restaurant.id} size="sm" />
                    </View>
                    <StarRating rating={restaurant.rating} />
                  </View>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                  <Text style={styles.restaurantCuisine}>{restaurant.cuisine}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollView: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white' },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#111827', flex: 1 },
  countBadge: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#F3F4F6', borderRadius: 10 },
  countText: { fontSize: 12, fontWeight: '900', color: '#6B7280' },
  scrollContent: { padding: 20, flexGrow: 1, paddingBottom: 60 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100, paddingHorizontal: 30 },
  emptyIcon: { width: 80, height: 80, backgroundColor: '#FEF2F2', borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 25 },
  emptyTitle: { fontSize: 24, fontWeight: '900', color: '#111827', marginBottom: 10 },
  emptySubtitle: { fontSize: 14, color: '#9CA3AF', textAlign: 'center', lineHeight: 22, fontWeight: '500', marginBottom: 30 },
  exploreBtn: { backgroundColor: '#F97316', paddingHorizontal: 30, paddingVertical: 18, borderRadius: 20, shadowColor: '#F97316', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 15 },
  exploreBtnText: { color: 'white', fontWeight: '900', fontSize: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15 },
  cardWrapper: { width: (width - 55) / 2, marginBottom: 20 },
  imageContainer: { width: '100%', aspectRatio: 1, borderRadius: 25, overflow: 'hidden', backgroundColor: '#E5E7EB', position: 'relative' },
  image: { width: '100%', height: '100%' },
  favBtnWrapper: { position: 'absolute', top: 10, left: 10 },
  ratingBox: { position: 'absolute', top: 10, right: 10, backgroundColor: 'white', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 10, fontWeight: '900', color: '#111827' },
  restaurantName: { fontSize: 16, fontWeight: '800', color: '#111827', marginTop: 12 },
  restaurantCuisine: { fontSize: 12, color: '#9CA3AF', fontWeight: '600', marginTop: 2 }
});

export default Favorites;
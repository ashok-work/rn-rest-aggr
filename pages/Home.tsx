import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions, 
  TextInput 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';
import { MOCK_RESTAURANTS } from '../constants';
import { useAppSelector } from '../store/hooks';

const { width } = Dimensions.get('window');

const Home = () => {
  const navigation = useNavigation<any>();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const user = useAppSelector(state => state.auth.user);

  const categories = ['All', 'Burgers', 'Sushi', 'Pasta', 'Healthy', 'Tacos'];

  const filtered = MOCK_RESTAURANTS.filter(r => 
    (activeCategory === 'All' || r.cuisine.includes(activeCategory)) &&
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={true} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Deliver to</Text>
            <View style={styles.locationRow}>
              <Text style={styles.locationText}>Home, 123 Food St.</Text>
              <FontAwesome6 name="chevron-down" size={12} color="#F97316" />
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Account')}>
            <Image source={{ uri: user?.avatar || 'https://i.pravatar.cc/150' }} style={styles.avatar} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchBar}>
            <FontAwesome6 name="magnifying-glass" size={16} color="#9CA3AF" />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search restaurants, dishes..."
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
        </View>

        {/* Categories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categoryContainer}
          style={styles.horizontalScroll}
        >
          {categories.map((cat) => (
            <TouchableOpacity 
              key={cat} 
              onPress={() => setActiveCategory(cat)}
              style={[styles.categoryBtn, activeCategory === cat && styles.categoryBtnActive]}
            >
              <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Slider */}
        <Text style={styles.sectionTitle}>Featured Picks</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          snapToInterval={width * 0.8 + 20}
          decelerationRate="fast"
          contentContainerStyle={styles.featuredContainer}
          style={styles.horizontalScroll}
        >
          {MOCK_RESTAURANTS.filter(r => r.featured).map((restaurant, idx) => (
            <Animated.View key={restaurant.id} entering={FadeInRight.delay(idx * 100)}>
              <TouchableOpacity 
                style={styles.featuredCard}
                onPress={() => navigation.navigate('Menu', { id: restaurant.id })}
              >
                <Image source={{ uri: restaurant.image }} style={styles.featuredImage} />
                <View style={styles.featuredOverlay}>
                  <Text style={styles.featuredName}>{restaurant.name}</Text>
                  <Text style={styles.featuredMeta}>{restaurant.cuisine} • {restaurant.deliveryTime}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>

        {/* Restaurant List */}
        <Text style={styles.sectionTitle}>Explore All</Text>
        <View style={styles.listContainer}>
          {filtered.map((restaurant, idx) => (
            <Animated.View key={restaurant.id} entering={FadeInUp.delay(idx * 100)}>
              <TouchableOpacity 
                style={styles.restaurantCard}
                onPress={() => navigation.navigate('Menu', { id: restaurant.id })}
              >
                <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
                <View style={styles.restaurantContent}>
                  <View style={styles.restaurantHeader}>
                    <Text style={styles.restaurantNameList}>{restaurant.name}</Text>
                    <View style={styles.ratingBadge}>
                      <FontAwesome6 name="star" size={10} color="#F97316" />
                      <Text style={styles.ratingText}>{restaurant.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.restaurantSub}>{restaurant.cuisine} • {restaurant.deliveryTime}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Home')}><FontAwesome6 name="house" size={20} color="#F97316" /></TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Favorites')}><FontAwesome6 name="heart" size={20} color="#9CA3AF" /></TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Orders')}><FontAwesome6 name="receipt" size={20} color="#9CA3AF" /></TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => navigation.navigate('Account')}><FontAwesome6 name="user" size={20} color="#9CA3AF" /></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 120, flexGrow: 1 },
  horizontalScroll: { flexGrow: 0 },
  header: { paddingHorizontal: 20, paddingBottom: 15, paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 12, color: '#9CA3AF', fontWeight: '600', textTransform: 'uppercase' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  locationText: { fontSize: 16, fontWeight: '800', color: '#111827' },
  avatar: { width: 44, height: 44, borderRadius: 15 },
  searchWrapper: { paddingHorizontal: 20, paddingVertical: 10 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 20, paddingHorizontal: 15, height: 55 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, fontWeight: '500' },
  categoryContainer: { paddingHorizontal: 20, paddingVertical: 15 },
  categoryBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 15, backgroundColor: '#F9FAFB', marginRight: 10, borderWidth: 1, borderColor: '#F3F4F6' },
  categoryBtnActive: { backgroundColor: '#F97316', borderColor: '#F97316' },
  categoryText: { fontWeight: '700', color: '#6B7280' },
  categoryTextActive: { color: '#FFFFFF' },
  sectionTitle: { fontSize: 22, fontWeight: '900', color: '#111827', paddingHorizontal: 20, marginTop: 20, marginBottom: 15 },
  featuredContainer: { paddingLeft: 20, paddingRight: 20 },
  featuredCard: { width: width * 0.8, height: 200, borderRadius: 30, overflow: 'hidden', marginRight: 15 },
  featuredImage: { width: '100%', height: '100%' },
  featuredOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: 'rgba(0,0,0,0.4)' },
  featuredName: { color: '#FFFFFF', fontSize: 20, fontWeight: '900' },
  featuredMeta: { color: '#E5E7EB', fontSize: 12, fontWeight: '600' },
  listContainer: { paddingHorizontal: 20 },
  restaurantCard: { marginBottom: 20, backgroundColor: '#FFFFFF', borderRadius: 25, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 5 },
  restaurantImage: { width: '100%', height: 180 },
  restaurantContent: { padding: 15 },
  restaurantHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  restaurantNameList: { fontSize: 18, fontWeight: '900', color: '#111827' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF7ED', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  ratingText: { fontSize: 12, fontWeight: '800', color: '#C2410C', marginLeft: 4 },
  restaurantSub: { fontSize: 13, color: '#9CA3AF', marginTop: 4, fontWeight: '500' },
  tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 85, backgroundColor: '#FFFFFF', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingBottom: 20 },
  tabItem: { padding: 10 }
});

export default Home;
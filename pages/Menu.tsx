
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions, 
  Modal,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';
import { addReview } from '../store/slices/reviewSlice';
import { MOCK_RESTAURANTS } from '../constants';
import { getDishSummary, getReviewSummary } from '../services/geminiService';
import FavoriteButton from '../components/FavoriteButton';
import CartFAB from '../components/CartFAB';

const { width } = Dimensions.get('window');

const StarRating = ({ rating, max = 5, interactive = false, onRate }: any) => {
  return (
    <View style={styles.starRow}>
      {[...Array(max)].map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= rating;
        return (
          <TouchableOpacity 
            key={i} 
            disabled={!interactive} 
            onPress={() => onRate && onRate(starValue)}
          >
            <FontAwesome6 
              name="star" 
              solid={isFilled} 
              size={12} 
              color={isFilled ? '#F97316' : '#E5E7EB'} 
              style={{ marginRight: 2 }}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const Menu = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { id } = route.params;
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const allReviews = useAppSelector((state) => state.reviews.reviews);
  
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [reviewAI, setReviewAI] = useState<{summary: string, verdict: string} | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const restaurant = MOCK_RESTAURANTS.find(r => r.id === id);
  const reviews = allReviews.filter(r => r.restaurantId === id);

  useEffect(() => {
    if (reviews.length > 0 && !reviewAI) {
      const fetchReviewAI = async () => {
        setIsSummarizing(true);
        const result = await getReviewSummary(restaurant?.name || 'this restaurant', reviews);
        setReviewAI(result);
        setIsSummarizing(false);
      };
      fetchReviewAI();
    }
  }, [reviews]);

  if (!restaurant) return null;

  const categories = Array.from(new Set(restaurant.menu.map(d => d.category)));

  const handleAddToCart = (dish: any) => {
    dispatch(addToCart({ dish, restaurantId: id }));
  };

  const fetchDishAI = async (dishId: string, name: string, desc: string) => {
    if (summaries[dishId]) return;
    const summary = await getDishSummary(name, desc);
    setSummaries(prev => ({ ...prev, [dishId]: summary }));
  };

  const handleReviewSubmit = () => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
      return;
    }
    if (!newComment.trim()) return;

    dispatch(addReview({
      restaurantId: id,
      userName: user!.name,
      userAvatar: user!.avatar,
      rating: newRating,
      comment: newComment
    }));

    setNewComment('');
    setNewRating(5);
    setShowReviewModal(false);
    setReviewAI(null);
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner */}
        <View style={styles.banner}>
          <Image source={{ uri: restaurant.image }} style={styles.bannerImage} />
          <View style={styles.bannerOverlay} />
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => navigation.goBack()}
          >
            <FontAwesome6 name="arrow-left" size={18} color="#111827" />
          </TouchableOpacity>
          <View style={styles.favContainer}>
            <FavoriteButton restaurantId={restaurant.id} size="lg" />
          </View>
        </View>

        {/* Content */}
        <View style={styles.headerCard}>
          <Text style={styles.statusLabel}>Highly Rated establishment</Text>
          <Text style={styles.title}>{restaurant.name}</Text>
          <View style={styles.cuisineRow}>
            <FontAwesome6 name="location-dot" size={12} color="#F97316" />
            <Text style={styles.cuisineText}>{restaurant.cuisine}</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{restaurant.rating}</Text>
              <Text style={styles.statLabel}>Score</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statBox}>
              <Text style={styles.statVal}>{restaurant.deliveryTime}</Text>
              <Text style={styles.statLabel}>Arrival</Text>
            </View>
          </View>
        </View>

        {/* Menu Sections */}
        {categories.map((cat, catIdx) => (
          <View key={cat} style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <View style={styles.sectionMarker} />
              <Text style={styles.sectionTitle}>{cat}</Text>
            </View>

            {restaurant.menu.filter(d => d.category === cat).map(dish => (
              <Animated.View 
                key={dish.id} 
                entering={FadeInUp.delay(catIdx * 100)}
                style={styles.dishCard}
              >
                <View style={styles.dishInfo}>
                  <View style={styles.dishHeader}>
                    <Text style={styles.dishName}>{dish.name}</Text>
                    <Text style={styles.dishPrice}>${dish.price.toFixed(2)}</Text>
                  </View>
                  <Text style={styles.dishDesc} numberOfLines={2}>{dish.description}</Text>
                  
                  {summaries[dish.id] ? (
                    <View style={styles.aiDishNote}>
                      <View style={styles.aiBadge}>
                        <FontAwesome6 name="wand-magic-sparkles" size={8} color="#F97316" />
                        <Text style={styles.aiBadgeText}>Chef's Note</Text>
                      </View>
                      <Text style={styles.aiNoteText}>"{summaries[dish.id]}"</Text>
                    </View>
                  ) : (
                    <TouchableOpacity 
                      onPress={() => fetchDishAI(dish.id, dish.name, dish.description)}
                      style={styles.aiAction}
                    >
                      <FontAwesome6 name="wand-magic-sparkles" size={10} color="#F97316" />
                      <Text style={styles.aiActionText}>SENSORY INSIGHT</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity 
                    onPress={() => handleAddToCart(dish)}
                    style={styles.addBtn}
                  >
                    <FontAwesome6 name="plus" size={12} color="white" />
                    <Text style={styles.addBtnText}>ADD TO BAG</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.dishImageWrapper}>
                  <Image source={{ uri: dish.image }} style={styles.dishImage} />
                </View>
              </Animated.View>
            ))}
          </View>
        ))}

        {/* AI Insight Card */}
        {reviews.length > 0 && (
          <View style={styles.aiSummaryCard}>
            <View style={styles.aiHeader}>
              <View style={styles.aiHeaderLeft}>
                <View style={styles.aiIcon}>
                  <FontAwesome6 name="wand-magic-sparkles" size={12} color="white" />
                </View>
                <Text style={styles.aiHeaderText}>REVIEW INTELLIGENCE</Text>
              </View>
              {reviewAI?.verdict && (
                <View style={styles.verdictBadge}>
                  <Text style={styles.verdictText}>{reviewAI.verdict}</Text>
                </View>
              )}
            </View>
            {isSummarizing ? (
              <ActivityIndicator color="#F97316" style={{ marginTop: 10 }} />
            ) : (
              <Text style={styles.aiSummaryText}>"{reviewAI?.summary}"</Text>
            )}
          </View>
        )}

        {/* Reviews */}
        <View style={styles.reviewsSection}>
          <View style={styles.reviewHeaderRow}>
            <Text style={styles.reviewTitle}>Community Stories</Text>
            <TouchableOpacity 
              onPress={() => setShowReviewModal(true)}
              style={styles.writeBtn}
            >
              <FontAwesome6 name="pen-nib" size={12} color="white" />
              <Text style={styles.writeBtnText}>Review</Text>
            </TouchableOpacity>
          </View>

          {reviews.map(review => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewUserRow}>
                <Image source={{ uri: review.userAvatar }} style={styles.reviewAvatar} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.reviewUserName}>{review.userName}</Text>
                  <Text style={styles.reviewDate}>{new Date(review.date).toLocaleDateString()}</Text>
                </View>
                <StarRating rating={review.rating} />
              </View>
              <Text style={styles.reviewComment}>"{review.comment}"</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <CartFAB />

      <Modal visible={showReviewModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Share the Vibe</Text>
            <View style={styles.modalStars}>
              <StarRating rating={newRating} interactive onRate={setNewRating} />
            </View>
            <TextInput 
              style={styles.modalInput}
              placeholder="How was your experience?"
              multiline
              value={newComment}
              onChangeText={setNewComment}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setShowReviewModal(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Discard</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleReviewSubmit} style={styles.submitBtn}>
                <Text style={styles.submitText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 120, flexGrow: 1 },
  banner: { height: 350, position: 'relative' },
  bannerImage: { width: '100%', height: '100%' },
  bannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  backBtn: { position: 'absolute', top: 50, left: 20, width: 44, height: 44, borderRadius: 15, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
  favContainer: { position: 'absolute', top: 50, right: 20 },
  headerCard: { marginTop: -60, marginHorizontal: 20, backgroundColor: 'white', borderRadius: 40, padding: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
  statusLabel: { fontSize: 10, fontWeight: '900', color: '#F97316', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 },
  title: { fontSize: 32, fontWeight: '900', color: '#111827' },
  cuisineRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 },
  cuisineText: { fontSize: 12, color: '#9CA3AF', fontWeight: '700', textTransform: 'uppercase' },
  statsContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 25, padding: 20, marginTop: 25 },
  statBox: { flex: 1, alignItems: 'center' },
  statVal: { fontSize: 20, fontWeight: '900', color: '#111827' },
  statLabel: { fontSize: 10, color: '#9CA3AF', fontWeight: '800', textTransform: 'uppercase', marginTop: 4 },
  divider: { width: 1, height: 40, backgroundColor: '#E5E7EB' },
  section: { marginTop: 40, paddingHorizontal: 20 },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  sectionMarker: { width: 4, height: 20, backgroundColor: '#F97316', borderRadius: 2, marginRight: 12 },
  sectionTitle: { fontSize: 22, fontWeight: '900', color: '#111827' },
  dishCard: { flexDirection: 'row', gap: 15, marginBottom: 30 },
  dishInfo: { flex: 1 },
  dishHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  dishName: { fontSize: 18, fontWeight: '800', color: '#111827', flex: 1 },
  dishPrice: { fontSize: 18, fontWeight: '900', color: '#111827' },
  dishDesc: { fontSize: 14, color: '#6B7280', lineHeight: 20, fontWeight: '500' },
  aiDishNote: { marginTop: 15, padding: 15, backgroundColor: '#FFF7ED', borderRadius: 20, borderWidth: 1, borderColor: '#FFEDD5' },
  aiBadge: { position: 'absolute', top: -10, left: 15, backgroundColor: 'white', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1, borderColor: '#FFEDD5', flexDirection: 'row', alignItems: 'center', gap: 5 },
  aiBadgeText: { fontSize: 8, fontWeight: '900', color: '#F97316', textTransform: 'uppercase' },
  aiNoteText: { fontSize: 12, fontStyle: 'italic', color: '#9A3412', fontWeight: '600' },
  aiAction: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#FFF7ED', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginTop: 15 },
  aiActionText: { fontSize: 10, fontWeight: '900', color: '#F97316' },
  addBtn: { backgroundColor: '#111827', alignSelf: 'flex-start', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 15, marginTop: 20, flexDirection: 'row', alignItems: 'center', gap: 10 },
  addBtnText: { color: 'white', fontSize: 11, fontWeight: '900' },
  dishImageWrapper: { width: 120, height: 120, borderRadius: 30, overflow: 'hidden' },
  dishImage: { width: '100%', height: '100%' },
  aiSummaryCard: { margin: 20, backgroundColor: '#111827', borderRadius: 35, padding: 30 },
  aiHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  aiHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  aiIcon: { width: 30, height: 30, backgroundColor: '#F97316', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  aiHeaderText: { color: '#F97316', fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  verdictBadge: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12 },
  verdictText: { color: '#FFEDD5', fontSize: 10, fontWeight: '900' },
  aiSummaryText: { color: '#E5E7EB', fontSize: 18, fontWeight: '500', lineHeight: 28, fontStyle: 'italic' },
  reviewsSection: { paddingHorizontal: 20, marginTop: 20 },
  reviewHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  reviewTitle: { fontSize: 22, fontWeight: '900', color: '#111827' },
  writeBtn: { backgroundColor: '#F97316', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  writeBtnText: { color: 'white', fontSize: 12, fontWeight: '800' },
  reviewCard: { backgroundColor: 'white', padding: 25, borderRadius: 30, marginBottom: 15, borderWidth: 1, borderColor: '#F3F4F6' },
  reviewUserRow: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 15 },
  reviewAvatar: { width: 44, height: 44, borderRadius: 15 },
  reviewUserName: { fontSize: 16, fontWeight: '800', color: '#111827' },
  reviewDate: { fontSize: 10, color: '#9CA3AF', fontWeight: '700' },
  reviewComment: { fontSize: 15, color: '#4B5563', lineHeight: 22, fontStyle: 'italic', fontWeight: '500' },
  starRow: { flexDirection: 'row' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 40, padding: 30, alignItems: 'center' },
  modalTitle: { fontSize: 24, fontWeight: '900', color: '#111827', marginBottom: 20 },
  modalStars: { marginBottom: 30 },
  modalInput: { width: '100%', backgroundColor: '#F3F4F6', borderRadius: 25, padding: 20, height: 120, fontSize: 16, textAlignVertical: 'top' },
  modalButtons: { flexDirection: 'row', gap: 15, marginTop: 30 },
  cancelBtn: { flex: 1, paddingVertical: 18, backgroundColor: '#F3F4F6', borderRadius: 20, alignItems: 'center' },
  cancelText: { fontWeight: '800', color: '#6B7280' },
  submitBtn: { flex: 1, paddingVertical: 18, backgroundColor: '#F97316', borderRadius: 20, alignItems: 'center' },
  submitText: { fontWeight: '900', color: 'white' }
});

export default Menu;

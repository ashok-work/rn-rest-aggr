
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';
import { addReview } from '../store/slices/reviewSlice';
import { MOCK_RESTAURANTS } from '../constants';
import { getDishSummary, getReviewSummary } from '../services/geminiService';
import FavoriteButton from '../components/FavoriteButton';

const StarRating: React.FC<{ rating: number; max?: number; interactive?: boolean; onRate?: (r: number) => void }> = ({ rating, max = 5, interactive = false, onRate }) => {
  return (
    <div className="flex items-center space-x-1">
      {[...Array(max)].map((_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= rating;
        return (
          <i
            key={i}
            onClick={() => interactive && onRate && onRate(starValue)}
            className={`${isFilled ? 'fas' : 'far'} fa-star ${isFilled ? 'text-orange-500' : 'text-gray-300'} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'text-xs'}`}
          ></i>
        );
      })}
    </div>
  );
};

const Menu: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const allReviews = useAppSelector((state) => state.reviews.reviews);
  
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [reviewAI, setReviewAI] = useState<{summary: string, verdict: string} | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
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
  }, [reviews, restaurant, reviewAI]);

  if (!restaurant) return <div className="p-10 text-center font-bold text-gray-400">Restaurant not found.</div>;

  const categories = Array.from(new Set(restaurant.menu.map(d => d.category)));

  const handleAddToCart = (dish: any) => {
    if (cartItems.length > 0 && cartItems[0].restaurantId !== id) {
      if (!confirm("Your cart contains items from another restaurant. Clear cart and start a new order here?")) {
        return;
      }
    }
    dispatch(addToCart({ dish, restaurantId: id! }));
  };

  const fetchDishAI = async (dishId: string, name: string, desc: string) => {
    if (summaries[dishId]) return;
    const summary = await getDishSummary(name, desc);
    setSummaries(prev => ({ ...prev, [dishId]: summary }));
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!newComment.trim()) return;

    dispatch(addReview({
      restaurantId: id!,
      userName: user!.name,
      userAvatar: user!.avatar,
      rating: newRating,
      comment: newComment
    }));

    setNewComment('');
    setNewRating(5);
    setShowReviewForm(false);
    setReviewAI(null); // Reset AI summary so it re-generates with new review data
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Visual Banner */}
      <div className="relative h-72 md:h-96">
        <img src={restaurant.image} className="w-full h-full object-cover" alt={restaurant.name} />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 w-12 h-12 bg-white/90 backdrop-blur rounded-2xl flex items-center justify-center shadow-2xl text-gray-900 hover:text-orange-600 z-20 transition-all active:scale-90"
        >
          <i className="fas fa-arrow-left"></i>
        </button>

        <div className="absolute top-8 right-8 z-20">
          <FavoriteButton restaurantId={restaurant.id} size="lg" />
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-6 -mt-24 relative z-10">
        {/* Restaurant Header Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-[3.5rem] p-10 md:p-14 shadow-2xl border border-gray-100 mb-16"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <p className="text-orange-600 font-black uppercase tracking-[0.3em] text-[10px]">
                Highly Rated establishment
              </p>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight leading-none">
                {restaurant.name}
              </h1>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs flex items-center">
                <i className="fas fa-map-marker-alt text-orange-500 mr-2"></i>
                {restaurant.cuisine}
              </p>
            </div>
            
            <div className="flex items-center space-x-10 bg-gray-50/80 backdrop-blur p-6 rounded-[2.5rem] border border-gray-100">
              <div className="text-center">
                <div className="text-orange-600 font-black text-2xl mb-1">{restaurant.rating}</div>
                <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Score</div>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div className="text-center">
                <div className="font-black text-gray-900 text-xl mb-1">{restaurant.deliveryTime}</div>
                <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Arrival</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Menu Section */}
        <div className="space-y-20 mb-32">
          {categories.map((cat, catIdx) => (
            <motion.section 
              key={cat}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIdx * 0.1 }}
            >
              <h2 className="text-3xl font-black mb-10 text-gray-900 flex items-center">
                <span className="w-2 h-10 bg-orange-500 rounded-full mr-5 shadow-lg shadow-orange-500/20"></span>
                {cat}
              </h2>
              
              <div className="grid grid-cols-1 gap-12">
                {restaurant.menu.filter(d => d.category === cat).map(dish => {
                  const inCart = cartItems.find(i => i.id === dish.id);
                  return (
                    <div 
                      key={dish.id} 
                      className="flex flex-col md:flex-row gap-8 group"
                    >
                      <div className="flex-1 order-2 md:order-1 space-y-4">
                        <div className="flex justify-between items-start">
                           <h4 className="text-2xl font-black text-gray-900 group-hover:text-orange-600 transition-colors leading-tight">
                             {dish.name}
                           </h4>
                           <span className="text-2xl font-black text-gray-900">${dish.price.toFixed(2)}</span>
                        </div>
                        
                        <p className="text-gray-500 leading-relaxed font-medium">
                          {dish.description}
                        </p>
                        
                        <div className="min-h-[40px]">
                           {summaries[dish.id] ? (
                             <motion.div 
                               initial={{ opacity: 0, x: -10 }} 
                               animate={{ opacity: 1, x: 0 }} 
                               className="text-[12px] bg-orange-50/60 text-orange-900 p-5 rounded-[2rem] border border-orange-100/50 italic leading-relaxed relative"
                             >
                               <div className="absolute -top-3 left-6 bg-white px-3 text-[9px] font-black uppercase text-orange-500 tracking-widest border border-orange-100 rounded-full">
                                  <i className="fas fa-sparkles mr-1.5"></i> Chef's Note
                               </div>
                               "{summaries[dish.id]}"
                             </motion.div>
                           ) : (
                             <button 
                               onClick={() => fetchDishAI(dish.id, dish.name, dish.description)}
                               className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 hover:text-orange-700 transition-all flex items-center bg-orange-50 px-4 py-2 rounded-full"
                             >
                               <i className="fas fa-magic mr-2 animate-pulse"></i> Sensory Insight
                             </button>
                           )}
                        </div>

                        <button 
                          onClick={() => handleAddToCart(dish)}
                          className={`w-full md:w-auto px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center space-x-3 ${inCart ? 'bg-green-600 text-white shadow-xl shadow-green-100' : 'bg-gray-900 text-white hover:bg-orange-600 shadow-xl shadow-gray-200'}`}
                        >
                          <i className={`fas ${inCart ? 'fa-check' : 'fa-plus'}`}></i>
                          <span>{inCart ? 'Added to Bag' : 'Add to Bag'}</span>
                        </button>
                      </div>
                      
                      {/* Dish Image with Quick-Add */}
                      <div className="relative w-full md:w-56 h-56 rounded-[3.5rem] overflow-hidden flex-shrink-0 shadow-2xl group-hover:scale-[1.02] transition-all duration-700 order-1 md:order-2">
                        <img src={dish.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={dish.name} />
                        <motion.button
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAddToCart(dish)}
                          className="absolute bottom-6 right-6 w-12 h-12 bg-orange-500/90 backdrop-blur-md text-white rounded-2xl flex items-center justify-center shadow-2xl border border-white/20 transition-all hover:bg-orange-600"
                        >
                          <i className="fas fa-plus text-lg"></i>
                        </motion.button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Reviews Section Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-24"></div>

        {/* Reviews Section */}
        <section id="reviews" className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Community Stories</h2>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2">
                {reviews.length} Verified Customer Reviews
              </p>
            </div>
            <button 
              onClick={() => isAuthenticated ? setShowReviewForm(true) : navigate('/login')}
              className="px-8 py-4 bg-orange-600 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 flex items-center"
            >
              <i className="fas fa-pen-nib mr-3"></i>
              Write a Review
            </button>
          </div>

          {/* AI Insights Card */}
          {reviews.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-gray-900 p-10 md:p-14 rounded-[4rem] text-white shadow-3xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-12 opacity-5">
                <i className="fas fa-brain text-[12rem]"></i>
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                      <i className="fas fa-sparkles text-sm"></i>
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-400">Review Intelligence</span>
                  </div>
                  {reviewAI?.verdict && (
                    <span className="px-5 py-2 bg-white/10 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 text-orange-200">
                      {reviewAI.verdict}
                    </span>
                  )}
                </div>
                {isSummarizing ? (
                  <div className="space-y-4">
                    <div className="h-5 bg-white/10 rounded-full w-full animate-pulse"></div>
                    <div className="h-5 bg-white/10 rounded-full w-2/3 animate-pulse"></div>
                  </div>
                ) : (
                  <p className="text-xl md:text-2xl font-medium leading-relaxed italic text-gray-200">
                    "{reviewAI?.summary || "Analyzing the latest feedback to provide you with the best experience..."}"
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Review List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.length === 0 ? (
              <div className="md:col-span-2 text-center py-32 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200">
                <i className="far fa-comments text-6xl text-gray-200 mb-8 block"></i>
                <p className="text-gray-400 font-black uppercase tracking-widest text-sm">No reviews yet. Share yours!</p>
              </div>
            ) : (
              reviews.map((review, idx) => (
                <motion.div 
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <img src={review.userAvatar} className="w-14 h-14 rounded-[1.25rem] border-4 border-white shadow-xl" alt={review.userName} />
                      <div>
                        <p className="font-black text-gray-900 text-lg">{review.userName}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                          {new Date(review.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="bg-orange-50/80 px-4 py-2 rounded-2xl border border-orange-100">
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed font-medium text-lg italic">
                    "{review.comment}"
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Review Submission Modal */}
      <AnimatePresence>
        {showReviewForm && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setShowReviewForm(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }} 
              className="relative bg-white w-full max-w-xl rounded-[4rem] p-12 md:p-16 shadow-3xl"
            >
              <div className="text-center mb-12">
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <i className="fas fa-heart text-2xl"></i>
                </div>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">Share the Vibe</h2>
                <p className="text-gray-400 text-sm mt-3 font-medium tracking-wide uppercase">Your rating for {restaurant.name}</p>
              </div>
              
              <form onSubmit={handleReviewSubmit} className="space-y-10">
                <div className="flex flex-col items-center bg-gray-50 p-8 rounded-[3rem] border border-gray-100">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">Select Rating</label>
                  <StarRating rating={newRating} interactive onRate={setNewRating} />
                </div>
                
                <div>
                  <textarea 
                    required
                    className="w-full p-8 bg-gray-50 rounded-[3rem] border-2 border-transparent focus:border-orange-500 focus:bg-white transition-all outline-none text-gray-700 h-44 font-medium text-lg leading-relaxed shadow-inner"
                    placeholder="Describe the textures, the service, the mood..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                </div>
                
                <div className="flex space-x-6">
                  <button type="button" onClick={() => setShowReviewForm(false)} className="flex-1 py-5 bg-gray-100 text-gray-700 font-black text-[11px] uppercase tracking-widest rounded-[2rem] active:scale-95 transition-all">
                    Discard
                  </button>
                  <button type="submit" className="flex-1 py-5 bg-orange-600 text-white font-black text-[11px] uppercase tracking-widest rounded-[2rem] shadow-2xl shadow-orange-100 active:scale-95 transition-all">
                    Post Feedback
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Menu;

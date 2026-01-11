import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator,
  Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addOrder } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';
import { MOCK_RESTAURANTS } from '../constants';
import { suggestOrderNotes } from '../services/geminiService';

const Checkout = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const cartItems = useAppSelector((state) => state.cart.items);
  const addresses = useAppSelector((state) => state.addresses.addresses);
  
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(addresses.find(a => a.isDefault) || addresses[0]);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAddressPicker, setShowAddressPicker] = useState(false);

  useEffect(() => {
    if (cartItems.length > 0) {
      const fetchSuggestions = async () => {
        const dishNames = cartItems.map(i => i.name);
        const suggestions = await suggestOrderNotes(dishNames);
        setAiSuggestions(suggestions);
      };
      fetchSuggestions();
    }
  }, [cartItems]);

  if (cartItems.length === 0) return null;

  const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery = 2.99;
  const platform = 0.99;
  const grandTotal = total + delivery + platform;

  const handleOrder = () => {
    if (!selectedAddress) return;
    setIsProcessing(true);
    setTimeout(() => {
      dispatch(addOrder({
        items: cartItems,
        total: grandTotal,
        restaurantName: MOCK_RESTAURANTS.find(r => r.id === cartItems[0].restaurantId)?.name || 'Restaurant',
        paymentMethod,
        note
      }));
      dispatch(clearCart());
      setIsProcessing(false);
      navigation.navigate('Orders');
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <FontAwesome6 name="arrow-left" size={18} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Review & Pay</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={true}
      >
        {/* Address */}
        <Animated.View entering={FadeInDown} style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesome6 name="location-dot" size={16} color="#F97316" />
            <Text style={styles.cardTitle}>Delivery Address</Text>
          </View>
          {selectedAddress ? (
            <TouchableOpacity 
              style={styles.addressSelect} 
              onPress={() => setShowAddressPicker(true)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.addressLabel}>{selectedAddress.label}</Text>
                <Text style={styles.addressVal} numberOfLines={1}>{selectedAddress.fullAddress}</Text>
              </View>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => navigation.navigate('Addresses')}>
              <Text style={styles.noAddress}>+ Add Address to Continue</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        {/* Note */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesome6 name="sticky-note" size={16} color="#F97316" />
            <Text style={styles.cardTitle}>Order Note</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestRow}>
            {aiSuggestions.map((s, idx) => (
              <TouchableOpacity 
                key={idx} 
                style={styles.suggestion} 
                onPress={() => setNote(p => p ? `${p}, ${s}` : s)}
              >
                <Text style={styles.suggestionText}>+ {s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TextInput 
            style={styles.noteInput}
            placeholder="Special instructions..."
            multiline
            value={note}
            onChangeText={setNote}
          />
        </Animated.View>

        {/* Payment */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.card}>
          <View style={styles.cardHeader}>
            <FontAwesome6 name="credit-card" size={16} color="#F97316" />
            <Text style={styles.cardTitle}>Payment Method</Text>
          </View>
          <View style={styles.payRow}>
            {['Credit Card', 'Cash', 'UPI'].map(m => (
              <TouchableOpacity 
                key={m} 
                style={[styles.payMethod, paymentMethod === m && styles.payMethodActive]}
                onPress={() => setPaymentMethod(m)}
              >
                <Text style={[styles.payText, paymentMethod === m && styles.payTextActive]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.sumTitle}>Order Summary</Text>
          <View style={styles.sumRow}>
            <Text style={styles.sumLabel}>Subtotal</Text>
            <Text style={styles.sumVal}>${total.toFixed(2)}</Text>
          </View>
          <View style={styles.sumRow}>
            <Text style={styles.sumLabel}>Delivery Fee</Text>
            <Text style={styles.sumVal}>${delivery.toFixed(2)}</Text>
          </View>
          <View style={styles.sumRow}>
            <Text style={styles.sumLabel}>Platform Fee</Text>
            <Text style={styles.sumVal}>${platform.toFixed(2)}</Text>
          </View>
          <View style={styles.sumDivider} />
          <View style={styles.sumRow}>
            <Text style={styles.grandLabel}>Total</Text>
            <Text style={styles.grandVal}>${grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.placeBtn, isProcessing && styles.placeBtnDisabled]}
          onPress={handleOrder}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.placeBtnText}>Confirm Order</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Simple Address Picker */}
      <Modal visible={showAddressPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Address</Text>
            {addresses.map(a => (
              <TouchableOpacity 
                key={a.id} 
                style={styles.addressPickerItem}
                onPress={() => { setSelectedAddress(a); setShowAddressPicker(false); }}
              >
                <Text style={styles.addressPickerLabel}>{a.label}</Text>
                <Text style={styles.addressPickerVal}>{a.fullAddress}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowAddressPicker(false)} style={styles.modalClose}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollView: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white' },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  title: { fontSize: 24, fontWeight: '900', color: '#111827' },
  scrollContent: { padding: 20, flexGrow: 1, paddingBottom: 60 },
  card: { backgroundColor: 'white', borderRadius: 25, padding: 25, marginBottom: 15 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: '900', color: '#111827' },
  addressSelect: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF7ED', padding: 20, borderRadius: 15, borderWidth: 1, borderColor: '#FFEDD5' },
  addressLabel: { fontSize: 16, fontWeight: '800', color: '#111827' },
  addressVal: { fontSize: 12, color: '#F97316', fontWeight: '600', marginTop: 2 },
  changeText: { color: '#F97316', fontWeight: '900', fontSize: 12 },
  noAddress: { textAlign: 'center', color: '#F97316', fontWeight: '800' },
  suggestRow: { marginBottom: 15 },
  suggestion: { backgroundColor: '#F3F4F6', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, marginRight: 8 },
  suggestionText: { fontSize: 10, fontWeight: '800', color: '#6B7280' },
  noteInput: { backgroundColor: '#F9FAFB', borderRadius: 15, padding: 15, height: 80, fontSize: 14, textAlignVertical: 'top' },
  payRow: { flexDirection: 'row', gap: 10 },
  payMethod: { flex: 1, paddingVertical: 15, alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 15 },
  payMethodActive: { backgroundColor: '#F97316' },
  payText: { fontWeight: '800', color: '#6B7280' },
  payTextActive: { color: 'white' },
  summaryCard: { backgroundColor: '#111827', borderRadius: 30, padding: 30, marginTop: 10 },
  sumTitle: { color: 'white', fontSize: 18, fontWeight: '900', marginBottom: 20 },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  sumLabel: { color: '#9CA3AF', fontWeight: '700' },
  sumVal: { color: 'white', fontWeight: '800' },
  sumDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 15 },
  grandLabel: { color: 'white', fontSize: 18, fontWeight: '900' },
  grandVal: { color: '#F97316', fontSize: 24, fontWeight: '900' },
  placeBtn: { backgroundColor: '#F97316', height: 70, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginTop: 30, shadowColor: '#F97316', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 15, elevation: 5 },
  placeBtnDisabled: { opacity: 0.7 },
  placeBtnText: { color: 'white', fontSize: 20, fontWeight: '900' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 30 },
  modalTitle: { fontSize: 22, fontWeight: '900', marginBottom: 25 },
  addressPickerItem: { padding: 20, backgroundColor: '#F9FAFB', borderRadius: 15, marginBottom: 10 },
  addressPickerLabel: { fontWeight: '800', fontSize: 16 },
  addressPickerVal: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  modalClose: { marginTop: 20, paddingVertical: 15, alignItems: 'center' },
  modalCloseText: { fontWeight: '900', color: '#F97316' }
});

export default Checkout;
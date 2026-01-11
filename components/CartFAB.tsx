
import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  ScrollView, 
  Image 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateQuantity, removeFromCart } from '../store/slices/cartSlice';

const CartFAB = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation<any>();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0) return null;

  return (
    <>
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setIsOpen(true)}
      >
        <View style={styles.fabIconRow}>
          <FontAwesome6 name="basket-shopping" size={20} color="white" />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartItems.reduce((s, i) => s + i.quantity, 0)}</Text>
          </View>
        </View>
        <Text style={styles.fabText}>${total.toFixed(2)}</Text>
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.dismissArea} onPress={() => setIsOpen(false)} />
          <Animated.View entering={SlideInRight} style={styles.drawer}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Your Basket</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <FontAwesome6 name="xmark" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
              {cartItems.map(item => (
                <View key={item.id} style={styles.itemCard}>
                  <Image source={{ uri: item.image }} style={styles.itemImage} />
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                    <View style={styles.qtyRow}>
                      <View style={styles.stepper}>
                        <TouchableOpacity 
                          onPress={() => dispatch(updateQuantity({id: item.id, delta: -1}))}
                          style={styles.stepBtn}
                        >
                          <Text style={styles.stepText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.quantity}</Text>
                        <TouchableOpacity 
                          onPress={() => dispatch(updateQuantity({id: item.id, delta: 1}))}
                          style={styles.stepBtn}
                        >
                          <Text style={styles.stepText}>+</Text>
                        </TouchableOpacity>
                      </View>
                      <TouchableOpacity onPress={() => dispatch(removeFromCart(item.id))}>
                        <Text style={styles.removeText}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.drawerFooter}>
              <View style={styles.footerRow}>
                <Text style={styles.subtotalLabel}>Subtotal</Text>
                <Text style={styles.subtotalVal}>${total.toFixed(2)}</Text>
              </View>
              <TouchableOpacity 
                style={styles.checkoutBtn}
                onPress={() => {
                  setIsOpen(false);
                  navigation.navigate('Checkout');
                }}
              >
                <Text style={styles.checkoutBtnText}>Checkout</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  fab: { position: 'absolute', bottom: 100, right: 20, backgroundColor: '#F97316', paddingHorizontal: 25, height: 65, borderRadius: 32, flexDirection: 'row', alignItems: 'center', gap: 15, shadowColor: '#F97316', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 10 },
  fabIconRow: { flexDirection: 'row', alignItems: 'center' },
  // Fixed invalid property names and borderWeight to borderWidth
  badge: { position: 'absolute', top: -10, right: -12, backgroundColor: 'white', width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#F97316' },
  badgeText: { fontSize: 10, fontWeight: '900', color: '#F97316' },
  fabText: { color: 'white', fontSize: 18, fontWeight: '900' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', flexDirection: 'row' },
  dismissArea: { flex: 1 },
  drawer: { width: '85%', backgroundColor: 'white', height: '100%', shadowColor: '#000', shadowOffset: { width: -5, height: 0 }, shadowOpacity: 0.1, shadowRadius: 15, elevation: 10 },
  drawerHeader: { padding: 30, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  drawerTitle: { fontSize: 24, fontWeight: '900', color: '#111827' },
  scrollContent: { padding: 25 },
  itemCard: { flexDirection: 'row', gap: 15, marginBottom: 25 },
  itemImage: { width: 80, height: 80, borderRadius: 20 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '800', color: '#111827' },
  itemPrice: { fontSize: 14, color: '#9CA3AF', fontWeight: '600', marginTop: 2 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 12 },
  stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 5 },
  stepBtn: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center' },
  stepText: { fontSize: 18, color: '#F97316', fontWeight: '800' },
  qtyText: { fontSize: 14, fontWeight: '900', color: '#111827', marginHorizontal: 8 },
  removeText: { fontSize: 12, color: '#EF4444', fontWeight: '700' },
  drawerFooter: { padding: 30, borderTopWidth: 1, borderTopColor: '#F3F4F6', backgroundColor: '#F9FAFB' },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  subtotalLabel: { fontSize: 16, color: '#9CA3AF', fontWeight: '700' },
  subtotalVal: { fontSize: 28, fontWeight: '900', color: '#111827' },
  checkoutBtn: { backgroundColor: '#F97316', height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', shadowColor: '#F97316', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 12 },
  checkoutBtnText: { color: 'white', fontSize: 18, fontWeight: '900' }
});

export default CartFAB;

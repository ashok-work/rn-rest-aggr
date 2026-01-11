
import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Modal
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { cancelOrder, updateOrderStatus } from '../store/slices/orderSlice';
import { OrderStatus } from '../types';
import { CANCEL_REASONS } from '../constants';

const OrderDetails = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { id } = route.params;
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.orders.orders);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [reason, setReason] = useState('');

  const order = orders.find(o => o.id === id);
  if (!order) return null;

  const statusSteps = [
    { status: OrderStatus.PENDING, label: 'Pending', icon: 'clock' },
    { status: OrderStatus.PREPARING, label: 'Cooking', icon: 'fire-burner' },
    { status: OrderStatus.OUT_FOR_DELIVERY, label: 'Shipping', icon: 'motorcycle' },
    { status: OrderStatus.DELIVERED, label: 'Arrived', icon: 'check-double' }
  ];

  const currentIdx = statusSteps.findIndex(s => s.status === order.status);
  const isCancelled = order.status === OrderStatus.CANCELLED;

  const handleCancel = () => {
    if (!reason) return;
    dispatch(cancelOrder({ id: order.id, reason }));
    setShowCancelModal(false);
  };

  const advanceStatus = () => {
    if (currentIdx < statusSteps.length - 1) {
      dispatch(updateOrderStatus({ id: order.id, status: statusSteps[currentIdx + 1].status }));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <FontAwesome6 name="arrow-left" size={18} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Order #{order.id.split('-')[1]}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!isCancelled && (
          <View style={styles.trackerCard}>
            <View style={styles.trackRow}>
              {statusSteps.map((step, idx) => (
                <View key={step.status} style={styles.stepContainer}>
                  <View style={[styles.stepIcon, idx <= currentIdx && styles.stepActive]}>
                    <FontAwesome6 
                      name={step.icon} 
                      size={14} 
                      color={idx <= currentIdx ? 'white' : '#D1D5DB'} 
                    />
                  </View>
                  <Text style={[styles.stepLabel, idx <= currentIdx && styles.labelActive]}>
                    {step.label}
                  </Text>
                  {idx < statusSteps.length - 1 && (
                    <View style={[styles.connector, idx < currentIdx && styles.connectorActive]} />
                  )}
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.simBtn} onPress={advanceStatus}>
              <Text style={styles.simBtnText}>Simulate Next Step</Text>
            </TouchableOpacity>
          </View>
        )}

        {isCancelled && (
          <View style={styles.cancelNotice}>
            <FontAwesome6 name="ban" size={24} color="#EF4444" />
            <Text style={styles.cancelNoticeText}>Order Cancelled: {order.cancelReason}</Text>
          </View>
        )}

        <View style={styles.receiptCard}>
          <Text style={styles.sectionTitle}>Summary</Text>
          {order.items.map(item => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.quantity}x {item.name}</Text>
              <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.receiptDivider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
          </View>
        </View>

        {(order.status === OrderStatus.PENDING || order.status === OrderStatus.PREPARING) && (
          <TouchableOpacity 
            style={styles.cancelAction} 
            onPress={() => setShowCancelModal(true)}
          >
            <Text style={styles.cancelActionText}>Cancel Order</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal visible={showCancelModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reason to Cancel</Text>
            {CANCEL_REASONS.map(r => (
              <TouchableOpacity 
                key={r} 
                style={[styles.reasonBtn, reason === r && styles.reasonBtnActive]}
                onPress={() => setReason(r)}
              >
                <Text style={[styles.reasonText, reason === r && styles.reasonTextActive]}>{r}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setShowCancelModal(false)} style={styles.modalCancel}>
                <Text style={styles.modalCancelText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancel} style={styles.modalConfirm}>
                <Text style={styles.modalConfirmText}>Confirm</Text>
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
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white' },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  title: { fontSize: 22, fontWeight: '900', color: '#111827' },
  scrollContent: { padding: 20 },
  trackerCard: { backgroundColor: 'white', borderRadius: 30, padding: 30, marginBottom: 20 },
  trackRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  stepContainer: { alignItems: 'center', flex: 1 },
  stepIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  stepActive: { backgroundColor: '#F97316' },
  stepLabel: { fontSize: 8, fontWeight: '800', textTransform: 'uppercase', marginTop: 10, color: '#9CA3AF' },
  labelActive: { color: '#111827' },
  connector: { position: 'absolute', top: 20, left: '50%', width: '100%', height: 2, backgroundColor: '#F3F4F6' },
  connectorActive: { backgroundColor: '#F97316' },
  simBtn: { backgroundColor: '#111827', paddingVertical: 12, borderRadius: 15, alignItems: 'center' },
  simBtnText: { color: 'white', fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  cancelNotice: { backgroundColor: '#FEF2F2', padding: 20, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 20 },
  cancelNoticeText: { color: '#EF4444', fontWeight: '700', flex: 1 },
  receiptCard: { backgroundColor: 'white', borderRadius: 30, padding: 30 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#111827', marginBottom: 20 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  itemName: { fontSize: 14, fontWeight: '600', color: '#4B5563' },
  itemPrice: { fontSize: 14, fontWeight: '800', color: '#111827' },
  receiptDivider: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 20 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between' },
  totalLabel: { fontSize: 18, fontWeight: '900', color: '#111827' },
  totalValue: { fontSize: 24, fontWeight: '900', color: '#F97316' },
  cancelAction: { marginTop: 25, alignSelf: 'center' },
  cancelActionText: { color: '#EF4444', fontWeight: '800', textDecorationLine: 'underline' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 40, padding: 30 },
  modalTitle: { fontSize: 22, fontWeight: '900', marginBottom: 25, textAlign: 'center' },
  reasonBtn: { padding: 18, backgroundColor: '#F3F4F6', borderRadius: 15, marginBottom: 10 },
  reasonBtnActive: { backgroundColor: '#F97316' },
  reasonText: { fontWeight: '700', color: '#4B5563' },
  reasonTextActive: { color: 'white' },
  modalButtons: { flexDirection: 'row', gap: 15, marginTop: 20 },
  modalCancel: { flex: 1, paddingVertical: 18, alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 15 },
  modalCancelText: { fontWeight: '800', color: '#6B7280' },
  modalConfirm: { flex: 1, paddingVertical: 18, alignItems: 'center', backgroundColor: '#EF4444', borderRadius: 15 },
  modalConfirmText: { fontWeight: '900', color: 'white' }
});

export default OrderDetails;

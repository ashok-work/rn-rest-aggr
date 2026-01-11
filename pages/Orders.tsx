import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useAppSelector } from '../store/hooks';
import { OrderStatus } from '../types';

const Orders = () => {
  const navigation = useNavigation<any>();
  const orders = useAppSelector((state) => state.orders.orders);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <FontAwesome6 name="arrow-left" size={18} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Order History</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={true}
      >
        {orders.length === 0 ? (
          <View style={styles.empty}>
            <FontAwesome6 name="utensils" size={48} color="#E5E7EB" />
            <Text style={styles.emptyText}>No orders yet</Text>
            <TouchableOpacity 
              style={styles.exploreBtn}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.exploreBtnText}>Start Ordering</Text>
            </TouchableOpacity>
          </View>
        ) : (
          orders.map((order, idx) => (
            <Animated.View 
              key={order.id} 
              entering={FadeInUp.delay(idx * 100)}
              style={styles.card}
            >
              <TouchableOpacity onPress={() => navigation.navigate('OrderDetails', { id: order.id })}>
                <View style={styles.cardHeader}>
                  <View style={styles.storeIcon}>
                    <FontAwesome6 name="shop" size={20} color="#F97316" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.restaurantName}>{order.restaurantName}</Text>
                    <Text style={styles.orderMeta}>
                      {new Date(order.date).toLocaleDateString()} • {order.items.length} items
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { 
                    backgroundColor: order.status === OrderStatus.CANCELLED ? '#FEF2F2' : '#F0FDF4' 
                  }]}>
                    <Text style={[styles.statusText, { 
                      color: order.status === OrderStatus.CANCELLED ? '#EF4444' : '#22C55E' 
                    }]}>{order.status}</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={styles.totalLabel}>Total Paid</Text>
                  <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))
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
  title: { fontSize: 24, fontWeight: '900', color: '#111827' },
  scrollContent: { padding: 20, flexGrow: 1, paddingBottom: 100 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { fontSize: 18, fontWeight: '700', color: '#9CA3AF', marginTop: 20, marginBottom: 30 },
  exploreBtn: { backgroundColor: '#F97316', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 15 },
  exploreBtnText: { color: 'white', fontWeight: '900' },
  card: { backgroundColor: 'white', borderRadius: 25, padding: 20, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  storeIcon: { width: 50, height: 50, backgroundColor: '#F9FAFB', borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  restaurantName: { fontSize: 18, fontWeight: '800', color: '#111827' },
  orderMeta: { fontSize: 12, color: '#9CA3AF', fontWeight: '600', marginTop: 2 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  statusText: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  cardFooter: { marginTop: 20, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#F3F4F6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 14, color: '#9CA3AF', fontWeight: '700' },
  totalValue: { fontSize: 20, fontWeight: '900', color: '#111827' }
});

export default Orders;
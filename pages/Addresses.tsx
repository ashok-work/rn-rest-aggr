import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Modal, 
  TextInput,
  Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addAddress, updateAddress, deleteAddress } from '../store/slices/addressSlice';
import { Address } from '../types';

const Addresses = () => {
  const dispatch = useAppDispatch();
  const addresses = useAppSelector((state) => state.addresses.addresses);
  const navigation = useNavigation<any>();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    label: 'Home',
    fullAddress: '',
    phone: '',
    isDefault: false
  });

  const handleOpenEdit = (addr: Address) => {
    setEditingId(addr.id);
    setFormData({
      label: addr.label,
      fullAddress: addr.fullAddress,
      phone: addr.phone,
      isDefault: addr.isDefault || false
    });
  };

  const handleSave = () => {
    if (!formData.fullAddress || !formData.phone) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (editingId) {
      dispatch(updateAddress({ id: editingId, data: formData }));
      setEditingId(null);
    } else {
      dispatch(addAddress(formData));
      setIsAdding(false);
    }
    
    setFormData({ label: 'Home', fullAddress: '', phone: '', isDefault: false });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <FontAwesome6 name="arrow-left" size={18} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Addresses</Text>
        <TouchableOpacity 
          onPress={() => { setIsAdding(true); setEditingId(null); setFormData({ label: 'Home', fullAddress: '', phone: '', isDefault: false }); }}
          style={styles.addBtn}
        >
          <FontAwesome6 name="plus" size={16} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={true}
      >
        {addresses.map((addr, idx) => (
          <Animated.View 
            key={addr.id}
            entering={FadeInUp.delay(idx * 100)}
            style={styles.addressCard}
          >
            <View style={styles.cardIcon}>
              <FontAwesome6 
                name={addr.label.toLowerCase() === 'home' ? 'house' : addr.label.toLowerCase() === 'work' ? 'briefcase' : 'location-dot'} 
                size={18} 
                color="#F97316" 
              />
            </View>
            <View style={styles.cardInfo}>
              <View style={styles.labelRow}>
                <Text style={styles.addressLabelName}>{addr.label}</Text>
                {addr.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
              </View>
              <Text style={styles.addressText}>{addr.fullAddress}</Text>
              <Text style={styles.phoneText}>{addr.phone}</Text>
            </View>
            <View style={styles.cardActions}>
              <TouchableOpacity onPress={() => handleOpenEdit(addr)} style={styles.actionBtn}>
                <FontAwesome6 name="pen" size={12} color="#9CA3AF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => dispatch(deleteAddress(addr.id))} style={styles.actionBtn}>
                <FontAwesome6 name="trash" size={12} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        ))}

        {addresses.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No saved addresses.</Text>
          </View>
        )}
      </ScrollView>

      <Modal visible={isAdding || !!editingId} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View entering={ZoomIn} style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingId ? 'Edit Address' : 'New Address'}</Text>
            
            <View style={styles.modalForm}>
              <Text style={styles.inputLabel}>Label</Text>
              <View style={styles.chipRow}>
                {['Home', 'Work', 'Other'].map(l => (
                  <TouchableOpacity 
                    key={l}
                    onPress={() => setFormData({ ...formData, label: l })}
                    style={[styles.chip, formData.label === l && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, formData.label === l && styles.chipTextActive]}>{l}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Full Address</Text>
              <TextInput 
                style={[styles.input, styles.textArea]}
                placeholder="Enter street, apartment, city..."
                multiline
                value={formData.fullAddress}
                onChangeText={t => setFormData({ ...formData, fullAddress: t })}
              />

              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput 
                style={styles.input}
                placeholder="+1 234 567 890"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={t => setFormData({ ...formData, phone: t })}
              />

              <TouchableOpacity 
                style={styles.checkboxRow}
                onPress={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
              >
                <View style={[styles.checkbox, formData.isDefault && styles.checkboxActive]}>
                  {formData.isDefault && <FontAwesome6 name="check" size={10} color="white" />}
                </View>
                <Text style={styles.checkboxLabel}>Set as default address</Text>
              </TouchableOpacity>

              <View style={styles.modalActions}>
                <TouchableOpacity onPress={() => { setIsAdding(false); setEditingId(null); }} style={styles.modalCancel}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave} style={styles.modalSave}>
                  <Text style={styles.modalSaveText}>Save Address</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollView: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', justifyContent: 'space-between' },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#111827' },
  addBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F97316', justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20, flexGrow: 1, paddingBottom: 60 },
  addressCard: { backgroundColor: 'white', borderRadius: 25, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  cardIcon: { width: 48, height: 48, backgroundColor: '#F9FAFB', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  cardInfo: { flex: 1 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  addressLabelName: { fontSize: 16, fontWeight: '800', color: '#111827' },
  defaultBadge: { backgroundColor: '#F0FDF4', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  defaultText: { fontSize: 8, fontWeight: '900', color: '#22C55E', textTransform: 'uppercase' },
  addressText: { fontSize: 13, color: '#6B7280', fontWeight: '500', marginBottom: 2 },
  phoneText: { fontSize: 11, color: '#9CA3AF', fontWeight: '700' },
  cardActions: { gap: 8 },
  actionBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { padding: 40, alignItems: 'center', borderStyle: 'dashed', borderWidth: 2, borderColor: '#E5E7EB', borderRadius: 25 },
  emptyText: { color: '#9CA3AF', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', borderRadius: 35, padding: 30 },
  modalTitle: { fontSize: 22, fontWeight: '900', color: '#111827', marginBottom: 25 },
  modalForm: { gap: 15 },
  inputLabel: { fontSize: 11, fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1 },
  chipRow: { flexDirection: 'row', gap: 10, marginBottom: 5 },
  chip: { flex: 1, height: 45, borderRadius: 12, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6' },
  chipActive: { backgroundColor: '#FFF7ED', borderColor: '#F97316' },
  chipText: { fontSize: 14, fontWeight: '700', color: '#6B7280' },
  chipTextActive: { color: '#F97316' },
  input: { backgroundColor: '#F3F4F6', borderRadius: 15, paddingHorizontal: 20, height: 55, fontSize: 14, fontWeight: '600' },
  textArea: { height: 100, textAlignVertical: 'top', paddingTop: 15 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 10 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: '#D1D5DB', justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { backgroundColor: '#F97316', borderColor: '#F97316' },
  checkboxLabel: { fontSize: 14, fontWeight: '700', color: '#4B5563' },
  modalActions: { flexDirection: 'row', gap: 15, marginTop: 10 },
  modalCancel: { flex: 1, height: 55, borderRadius: 15, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  modalCancelText: { fontWeight: '800', color: '#6B7280' },
  modalSave: { flex: 1, height: 55, borderRadius: 15, backgroundColor: '#F97316', justifyContent: 'center', alignItems: 'center' },
  modalSaveText: { fontWeight: '900', color: 'white' }
});

export default Addresses;

import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { generateTasteProfile } from '../services/geminiService';

const Account = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();
  const { user } = useAppSelector((state) => state.auth);
  const orders = useAppSelector((state) => state.orders.orders);
  const [tasteProfile, setTasteProfile] = useState<string>('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  useEffect(() => {
    const fetchTaste = async () => {
      const allItemNames = orders.flatMap(o => o.items.map(i => i.name));
      if (allItemNames.length > 0) {
        setIsLoadingProfile(true);
        const profile = await generateTasteProfile(allItemNames);
        setTasteProfile(profile);
        setIsLoadingProfile(false);
      }
    };
    fetchTaste();
  }, [orders]);

  const handleLogout = () => {
    dispatch(logout());
    navigation.navigate('Login');
  };

  const menuItems = [
    { title: 'Order History', icon: 'receipt', color: '#F97316', route: 'Orders' },
    { title: 'My Addresses', icon: 'location-dot', color: '#10B981', route: 'Addresses' },
    { title: 'Favorites', icon: 'heart', color: '#EF4444', route: 'Favorites' },
    { title: 'Security', icon: 'lock', color: '#3B82F6', route: 'ChangePassword' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.profileHeader}>
        <Image source={{ uri: user?.avatar }} style={styles.avatar} />
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <Animated.View entering={FadeInUp.delay(200)} style={styles.aiCard}>
        <View style={styles.aiHeader}>
          <FontAwesome6 name="wand-magic-sparkles" size={12} color="white" />
          <Text style={styles.aiHeaderText}>TASTE PROFILE</Text>
        </View>
        {isLoadingProfile ? (
          <ActivityIndicator color="white" />
        ) : (
          <View>
            <Text style={styles.profileTitle}>
              {tasteProfile.split(':')[0] || "Exploring your taste..."}
            </Text>
            <Text style={styles.profileDesc}>
              "{tasteProfile.split(':')[1]?.trim() || "Order more to let AI define your palate."}"
            </Text>
          </View>
        )}
      </Animated.View>

      <View style={styles.menuList}>
        {menuItems.map((item, idx) => (
          <TouchableOpacity 
            key={idx} 
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.route)}
          >
            <View style={[styles.iconWrapper, { backgroundColor: item.color + '20' }]}>
              <FontAwesome6 name={item.icon} size={18} color={item.color} />
            </View>
            <Text style={styles.menuText}>{item.title}</Text>
            <FontAwesome6 name="chevron-right" size={14} color="#D1D5DB" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
          <View style={styles.logoutIcon}>
            <FontAwesome6 name="arrow-right-from-bracket" size={18} color="#EF4444" />
          </View>
          <Text style={[styles.menuText, { color: '#EF4444' }]}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  profileHeader: { alignItems: 'center', paddingVertical: 60, backgroundColor: 'white' },
  // Fixed borderWeight to borderWidth
  avatar: { width: 110, height: 110, borderRadius: 40, borderWidth: 4, borderColor: '#F3F4F6' },
  userName: { fontSize: 26, fontWeight: '900', color: '#111827', marginTop: 15 },
  userEmail: { fontSize: 14, color: '#9CA3AF', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  aiCard: { margin: 25, padding: 30, backgroundColor: '#111827', borderRadius: 40, shadowColor: '#F97316', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 20 },
  aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 15 },
  aiHeaderText: { color: '#F97316', fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  profileTitle: { color: 'white', fontSize: 22, fontWeight: '900', marginBottom: 10 },
  profileDesc: { color: '#D1D5DB', fontSize: 14, fontStyle: 'italic', lineHeight: 22, fontWeight: '500' },
  menuList: { paddingHorizontal: 25, paddingBottom: 50 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 20, borderRadius: 25, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  iconWrapper: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  menuText: { flex: 1, fontSize: 16, fontWeight: '800', color: '#374151' },
  logoutItem: { marginTop: 10, borderColor: '#FEE2E2', borderWidth: 1 },
  logoutIcon: { width: 48, height: 48, backgroundColor: '#FEF2F2', borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 15 }
});

export default Account;

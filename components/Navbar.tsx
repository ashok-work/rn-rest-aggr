
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useAppSelector } from '../store/hooks';

const Navbar: React.FC = () => {
  const navigation = useNavigation<any>();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.logoContainer} 
        onPress={() => navigation.navigate('Home')}
      >
        <View style={styles.logoIcon}>
          <FontAwesome6 name="utensils" size={16} color="white" />
        </View>
        <Text style={styles.logoText}>BiteDash</Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        {isAuthenticated ? (
          <TouchableOpacity 
            style={styles.profileBtn}
            onPress={() => navigation.navigate('Account')}
          >
            <Image source={{ uri: user?.avatar }} style={styles.avatar} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.loginBtn}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginBtnText}>Login</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    backgroundColor: '#F97316',
    padding: 8,
    borderRadius: 10,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F97316',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  profileBtn: {
    padding: 2,
  },
  loginBtn: {
    backgroundColor: '#F97316',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  loginBtnText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 14,
  },
});

export default Navbar;

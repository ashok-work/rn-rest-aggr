
import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const ResetPassword = () => {
  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigation = useNavigation<any>();

  const handleReset = () => {
    if (!pass || !confirm) return;
    if (pass === confirm) {
      Alert.alert("Success", "Password reset successfully!");
      navigation.navigate('Login');
    } else {
      Alert.alert("Error", "Passwords do not match");
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.card}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <FontAwesome6 name="shield-halved" size={24} color="white" />
            </View>
            <Text style={styles.title}>New Password</Text>
            <Text style={styles.subtitle}>Secure your account with a new pass</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.inputWrapper}>
                <FontAwesome6 name="lock" size={14} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput 
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  value={pass}
                  onChangeText={setPass}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <FontAwesome6 name="lock" size={14} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput 
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry
                  value={confirm}
                  onChangeText={setConfirm}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleReset}>
              <Text style={styles.buttonText}>Update Password</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  card: {
    backgroundColor: 'white',
    borderRadius: 35,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  header: { alignItems: 'center', marginBottom: 35 },
  iconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#F97316',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 26, fontWeight: '900', color: '#111827', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#9CA3AF', fontWeight: '500' },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: 11, fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    paddingHorizontal: 15,
    height: 55,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#111827', fontSize: 15, fontWeight: '600' },
  button: {
    backgroundColor: '#F97316',
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '900' },
});

export default ResetPassword;

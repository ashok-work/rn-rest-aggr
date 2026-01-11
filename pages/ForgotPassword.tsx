
import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const navigation = useNavigation<any>();

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(600)} style={styles.card}>
          {!sent ? (
            <>
              <View style={styles.header}>
                <View style={styles.iconContainer}>
                  <FontAwesome6 name="key" size={24} color="white" />
                </View>
                <Text style={styles.title}>Forgot Password?</Text>
                <Text style={styles.subtitle}>Enter your email to receive a reset link</Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email Address</Text>
                  <View style={styles.inputWrapper}>
                    <FontAwesome6 name="envelope" size={14} color="#9CA3AF" style={styles.inputIcon} />
                    <TextInput 
                      style={styles.input}
                      placeholder="john@example.com"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                    />
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.button} 
                  onPress={() => setSent(true)}
                >
                  <Text style={styles.buttonText}>Send Reset Link</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={styles.footerLink} 
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.linkText}>Back to Login</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.successContainer}>
              <View style={[styles.iconContainer, { backgroundColor: '#10B981' }]}>
                <FontAwesome6 name="check" size={24} color="white" />
              </View>
              {/* Fixed: replaced invalid h2 tag with Text for React Native */}
              <Text style={styles.successTitle}>Check your inbox</Text>
              <Text style={styles.successSubtitle}>
                We've sent reset instructions to <Text style={styles.boldText}>{email}</Text>
              </Text>
              
              <TouchableOpacity 
                style={styles.mockResetBtn}
                onPress={() => navigation.navigate('ResetPassword')}
              >
                <Text style={styles.mockResetText}>Go to Mock Reset Page</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.doneBtn}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.doneBtnText}>Back to Login</Text>
              </TouchableOpacity>
            </View>
          )}
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
  subtitle: { fontSize: 14, color: '#9CA3AF', fontWeight: '500', textAlign: 'center' },
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
    marginTop: 10,
  },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '900' },
  footerLink: { marginTop: 25, alignSelf: 'center' },
  linkText: { color: '#9CA3AF', fontSize: 14, fontWeight: '700' },
  successContainer: { alignItems: 'center', paddingVertical: 20 },
  successTitle: { fontSize: 24, fontWeight: '900', color: '#111827', marginBottom: 10 },
  successSubtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22, marginBottom: 30 },
  boldText: { fontWeight: '800', color: '#111827' },
  mockResetBtn: { marginBottom: 20 },
  mockResetText: { color: '#F97316', fontWeight: '800', textDecorationLine: 'underline' },
  doneBtn: { backgroundColor: '#F3F4F6', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 15 },
  doneBtnText: { color: '#4B5563', fontWeight: '800' }
});

export default ForgotPassword;

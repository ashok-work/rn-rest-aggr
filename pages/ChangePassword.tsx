
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

const ChangePassword = () => {
  const navigation = useNavigation<any>();
  const [form, setForm] = useState({ old: '', new: '', confirm: '' });

  const handleSubmit = () => {
    if (!form.old || !form.new || !form.confirm) return;
    if (form.new !== form.confirm) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    Alert.alert("Success", "Password updated successfully!");
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <FontAwesome6 name="arrow-left" size={18} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown} style={styles.card}>
          <Text style={styles.title}>Update Password</Text>
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Old Password</Text>
              <TextInput 
                style={styles.input}
                secureTextEntry
                placeholder="••••••••"
                value={form.old}
                onChangeText={t => setForm({...form, old: t})}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <TextInput 
                style={styles.input}
                secureTextEntry
                placeholder="••••••••"
                value={form.new}
                onChangeText={t => setForm({...form, new: t})}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm New Password</Text>
              <TextInput 
                style={styles.input}
                secureTextEntry
                placeholder="••••••••"
                value={form.confirm}
                onChangeText={t => setForm({...form, confirm: t})}
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
                <Text style={styles.saveText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white' },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: '#111827' },
  scrollContent: { padding: 20 },
  card: { backgroundColor: 'white', borderRadius: 30, padding: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  title: { fontSize: 24, fontWeight: '900', color: '#111827', marginBottom: 30 },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: 11, fontWeight: '800', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1 },
  input: { backgroundColor: '#F3F4F6', borderRadius: 18, paddingHorizontal: 20, height: 55, fontSize: 15, fontWeight: '600', color: '#111827' },
  buttonRow: { flexDirection: 'row', gap: 15, marginTop: 15 },
  cancelBtn: { flex: 1, height: 55, borderRadius: 18, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  cancelText: { fontWeight: '800', color: '#6B7280' },
  saveBtn: { flex: 1, height: 55, borderRadius: 18, backgroundColor: '#F97316', justifyContent: 'center', alignItems: 'center' },
  saveText: { fontWeight: '900', color: 'white' }
});

export default ChangePassword;


import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser } from './store/slices/authSlice';
import { useAppDispatch } from './store/hooks';

// Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Account from './pages/Account';
import ChangePassword from './pages/ChangePassword';
import Addresses from './pages/Addresses';
import Favorites from './pages/Favorites';

const Stack = createStackNavigator();

const NavigationContent = () => {
  const dispatch = useAppDispatch();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const hydrateAuth = async () => {
      try {
        const userStr = await AsyncStorage.getItem('user');
        if (userStr) {
          dispatch(setUser(JSON.parse(userStr)));
        }
      } catch (e) {
        console.error("Failed to restore session", e);
      } finally {
        setIsReady(true);
      }
    };
    hydrateAuth();
  }, [dispatch]);

  if (!isReady) {
    return null; 
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#F9FAFB' },
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="Checkout" component={Checkout} />
        <Stack.Screen name="Orders" component={Orders} />
        <Stack.Screen name="OrderDetails" component={OrderDetails} />
        <Stack.Screen name="Account" component={Account} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="Addresses" component={Addresses} />
        <Stack.Screen name="Favorites" component={Favorites} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <NavigationContent />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;

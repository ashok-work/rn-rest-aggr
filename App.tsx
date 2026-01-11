import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser } from './store/slices/authSlice';
import { setOrders } from './store/slices/orderSlice';
import { setAddresses } from './store/slices/addressSlice';
import { setReviews } from './store/slices/reviewSlice';
import { setFavorites } from './store/slices/favoriteSlice';
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
    const hydrateAllState = async () => {
      try {
        const [user, orders, addresses, reviews, favorites] = await Promise.all([
          AsyncStorage.getItem('user'),
          AsyncStorage.getItem('orders'),
          AsyncStorage.getItem('addresses'),
          AsyncStorage.getItem('reviews'),
          AsyncStorage.getItem('favorites'),
        ]);

        if (user) dispatch(setUser(JSON.parse(user)));
        if (orders) dispatch(setOrders(JSON.parse(orders)));
        if (addresses) dispatch(setAddresses(JSON.parse(addresses)));
        if (reviews) dispatch(setReviews(JSON.parse(reviews)));
        if (favorites) dispatch(setFavorites(JSON.parse(favorites)));
      } catch (e) {
        console.error("Failed to restore session state", e);
      } finally {
        setIsReady(true);
      }
    };
    hydrateAllState();
  }, [dispatch]);

  if (!isReady) {
    return null; 
  }

  return (
    <View style={styles.rootContainer}>
      <NavigationContainer>
        <Stack.Navigator 
          id="MainStack"
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
    </View>
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

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
  }
});

export default App;
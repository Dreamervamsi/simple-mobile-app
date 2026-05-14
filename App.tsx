import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';
import { store } from './store';
import HomeScreen from './src/screens/HomeScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import CartScreen from './src/screens/CartScreen';
import { RootStackParamList } from './src/types/navigation';
import { useAppLifecycle } from './hooks/useAppLifecycle';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppContent() {
  useAppLifecycle();
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Details" 
          component={DetailsScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Cart" 
          component={CartScreen} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function App() {
  return (
    <Provider store={store}>
      <StatusBar barStyle="dark-content" />
      <AppContent />
    </Provider>
  );
}

export default App;

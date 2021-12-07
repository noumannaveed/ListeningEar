import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { View, StyleSheet } from 'react-native';
import { ScreenNavigator } from './navigation/ScreenNavigator';


import messaging from '@react-native-firebase/messaging';

var fcmUnsubscribe = null;

const App = () => {
  return (
    <ScreenNavigator />
  );
};

const styles = StyleSheet.create({

});

export default App;

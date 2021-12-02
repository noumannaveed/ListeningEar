import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { View, StyleSheet } from 'react-native';
import { ScreenNavigator } from './navigation/ScreenNavigator';


import messaging from '@react-native-firebase/messaging';

var fcmUnsubscribe = null;

const App = () => {
  // useEffect(() => {
  //   messaging()
  //     .requestPermission()
  //     .then(authStatus => {
  //       console.log('APNs Status: ', authStatus);
  //       if (authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL) {
  //         messaging()
  //         .getToken()
  //         .then(token => {
  //           console.log('messaging.getToken: ', token);
  //         });
  //         messaging().onTokenRefresh(token => {
  //           console.log('messaging.onTokenRefresh: ', token);
  //         });
  //         fcmUnsubscribe = messaging().onMessage(async remoteMessage => {
  //           console.log('A new message arrived! ', remoteMessage);
  //         });
  //       }
  //     })
  //     .catch(err => {
  //       console.log('messaging.requestPermission Error: ', err);
  //     });
  // }, [])
  return (
    <ScreenNavigator />
  );
};

const styles = StyleSheet.create({

});

export default App;

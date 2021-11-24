import React,{useEffect} from 'react';
import { Alert } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Splash from '../screens/Splash';
import LogIn from '../screens/LogIn';
import SignUp from '../screens/SignUp';
import ProfileQuestion from '../screens/ProfileQuestion';
import PhoneNumber from '../screens/PhoneNumber';
import Notification from '../screens/Notification';
import PreviousListener from '../screens/PreviousListener';
import WaitingRoom from '../screens/WaitingRoom';
import UserConnecting from '../screens/UserConnecting';
import ThankYou from '../screens/ThankYou';

const Stack = createStackNavigator();

import messaging from '@react-native-firebase/messaging';

export const ScreenNavigator = () => {
    const getFCMToken = async () => {
            const fcmToken = await messaging().getToken();
            // return fcmToken;
            console.log('Token=',fcmToken);
        }
      useEffect(()=>{
          getFCMToken()
          const unsubscribe = messaging().onMessage(async remoteMessage => {
            Alert.alert(
                // remoteMessage.notification.title,
                 JSON.stringify(remoteMessage.notification.title),
                 JSON.stringify(remoteMessage.notification.body));
          });
          return unsubscribe;
      },[])  
      

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Splash"
                    component={Splash}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="LogIn"
                    component={LogIn}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="SignUp"
                    component={SignUp}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="ProfileQuestion"
                    component={ProfileQuestion}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="PhoneNumber"
                    component={PhoneNumber}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="Notification"
                    component={Notification}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="PreviousListener"
                    component={PreviousListener}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="WaitingRoom"
                    component={WaitingRoom}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="UserConnecting"
                    component={UserConnecting}
                    options={{headerShown: false}}
                />
                <Stack.Screen
                    name="ThankYou"
                    component={ThankYou}
                    options={{headerShown: false}}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Splash from '../screens/Splash';
import LogIn from '../screens/LogIn';
import SignUp from '../screens/SignUp';
import PhoneNumber from '../screens/PhoneNumber';
import Notification from '../screens/Notification';
import PreviousListener from '../screens/PreviousListener';
import WaitingRoom from '../screens/WaitingRoom';
import UserConnecting from '../screens/UserConnecting';
import ThankYou from '../screens/ThankYou';
import ChatScreen from '../screens/ChatScreen';
import SignIn from '../screens/SignIn';
import EditProfile from '../screens/EditProfile';
import CallScreen from '../audioCall/App';
import IncomingCall from '../audioCall/IncomingCall';
import NoConnectionScreen from '../screens/NoConnectionScreen';
import ForgotPassword from '../screens/ForgotPassword';

const Stack = createStackNavigator();

export const ScreenNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Splash"
                    component={Splash}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="LogIn"
                    component={LogIn}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="SignIn"
                    component={SignIn}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="SignUp"
                    component={SignUp}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="PhoneNumber"
                    component={PhoneNumber}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Notification"
                    component={Notification}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="PreviousListener"
                    component={PreviousListener}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="WaitingRoom"
                    component={WaitingRoom}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="UserConnecting"
                    component={UserConnecting}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ThankYou"
                    component={ThankYou}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="EditProfile"
                    component={EditProfile}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ChatScreen"
                    component={ChatScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="CallScreen"
                    component={CallScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="IncomingCall"
                    component={IncomingCall}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="NoConnectionScreen"
                    component={NoConnectionScreen}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="ForgotPassword"
                    component={ForgotPassword}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
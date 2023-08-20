import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, SafeAreaView, ImageBackground, Dimensions, Alert } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Images } from "../assets/Images";

import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';

const { height, width } = Dimensions.get('screen');
const Splash = ({ navigation }) => {
    const checkLogin = async () => {
        let value = await AsyncStorage.getItem('uid');
        console.log('splash=', value);
        setTimeout(() => {
            if (value === null) {
                navigation.replace("LogIn");
            } else if (value != null) {
                navigation.replace("PhoneNumber");
            }
        }, 5000);
    }
    useEffect(() => {
        checkLogin();
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            if (remoteMessage.data.type === 'new-request') {
                const user = JSON.parse(remoteMessage.data.user);
                console.log(remoteMessage.data.user);
                const image = user[0].image;
                const senderUid = JSON.parse(remoteMessage.data.uid);
                const connectionId = JSON.parse(remoteMessage.data.connection);
                const connectionid = connectionId[0];
                const story = JSON.parse(remoteMessage.data.story);
                navigation.replace('UserConnecting', { image, user, senderUid, connectionid, story });
                Alert.alert(
                    JSON.stringify(remoteMessage.notification.title),
                    JSON.stringify(remoteMessage.notification.body),
                );
            } else if (remoteMessage.data.type === 'request-accepted') {
                const connection = remoteMessage.data.connectionid;
                firestore()
                    .collection('Connection')
                    .doc(connection)
                    .onSnapshot(doc => {
                        if (doc.exists) {
                            if (doc.data().responded === 'true') {
                                navigation.replace('PreviousListener');
                            }
                        }
                    })
                Alert.alert(
                    JSON.stringify(remoteMessage.notification.title),
                    JSON.stringify(remoteMessage.notification.body),
                );
            }
            else if (remoteMessage.data.type === 'request-rejected') {
                navigation.replace('PreviousListener');
                Alert.alert(
                    JSON.stringify(remoteMessage.notification.title),
                    JSON.stringify(remoteMessage.notification.body),
                );
            }
            else if (remoteMessage.data.type === 'IncomingCall') {
                let call = JSON.parse(remoteMessage.data.call)
                console.log("notiuserrrrrr=>", call.user);
                navigation.navigate('IncomingCall', { channelName: call.channelName, user: call.user, type: "Incoming" });
            }
            else if (remoteMessage.data.type === 'CancelCall') {
                Alert.alert(
                    JSON.stringify(remoteMessage.data),
                    JSON.stringify(remoteMessage.data),
                );
                navigation.popToTop()
            }
        });
        console.log(unsubscribe);
    }, [])

    return (
        <SafeAreaView>
            <View>
                <ImageBackground style={styles.black}>
                    <Image
                        style={styles.logo}
                        source={Images.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.text}>Parker Mason Management, LLC</Text>
                </ImageBackground>
                <ImageBackground
                    source={Images.sound_wave}
                    style={styles.wave}
                >
                </ImageBackground>
                <View style={styles.loading}></View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    black: {
        backgroundColor: 'black',
        height: height * 0.7,
    },
    logo: {
        alignSelf: 'center',
        marginVertical: height * 0.1,
        height: height * 0.5,
        width: width * 0.73,
    },
    text: {
        color: 'white',
        position: 'absolute',
        bottom: height * 0.1,
        alignSelf: 'center',
        fontSize: 18,
        fontFamily: 'Roboto-Regular',
    },
    wave: {
        height: height * 0.4,
        width: width * 1,
        bottom: height * 0.2,
    },
    loading: {
        borderBottomWidth: width * 0.02,
        borderColor: '#FFC69B',
        position: 'absolute',
        bottom: height * 0.125,
        width: width * 0.7,
    },
});

export default Splash;
import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, SafeAreaView, ImageBackground, Dimensions, Alert } from "react-native";

import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Images } from "../content/Images";

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
                const image = user[0].image;
                const senderUid = JSON.parse(remoteMessage.data.uid);
                const connectionId = JSON.parse(remoteMessage.data.connection);
                const connectionid = connectionId[0];
                navigation.navigate('UserConnecting', { image, user, senderUid, connectionid });
            } else if (remoteMessage.data.type === 'request-accepted') {
                const connection = remoteMessage.data.connectionid;
                firestore()
                    .collection('Connection')
                    .doc(connection)
                    .onSnapshot(doc => {
                        if (doc.exists) {
                            if (doc.data().responded === 'true') {
                                navigation.navigate('PreviousListener');
                            }
                        }
                    })
            }
            else if (remoteMessage.data.type != 'request-rejected') {
                navigation.navigate('PreviousListener');
            }
            else if (remoteMessage.data.type != 'new-message') {
                Alert.alert(
                    JSON.stringify(remoteMessage.notification.title),
                    JSON.stringify(remoteMessage.notification.body),
                );
            }
        });
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
        height: h('70%'),
    },
    logo: {
        alignSelf: 'center',
        marginVertical: h('10%'),
        height: h('28%'),
        width: w('43%'),
    },
    text: {
        color: 'white',
        position: 'absolute',
        bottom: ('10%'),
        alignSelf: 'center',
        fontSize: 18,
        fontFamily: 'Roboto-Regular',
    },
    wave: {
        height: height * 0.4,
        width: width * 1,
        // position: 'absolute',
        bottom: '20%',
    },
    loading: {
        borderBottomWidth: 7,
        borderColor: '#FFC69B',
        position: 'absolute',
        bottom: 0,
        width: w('70%')
    },
});

export default Splash;
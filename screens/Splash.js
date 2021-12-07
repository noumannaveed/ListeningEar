import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, SafeAreaView, ImageBackground, Dimensions, Alert } from "react-native";

import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Images } from "../content/Images";

import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';

const { height, width } = Dimensions.get('screen');
const Splash = ({ navigation }) => {
    // const image = '';
    const checkLogin = async () => {
        let value = await AsyncStorage.getItem('uid');
        console.log('splash=', value);
        // let parse = JSON.parse(value);
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
            // console.log('senderid=',senderUid);
            // console.log('user=',image);
            if (remoteMessage.data.type === 'new-request') {
                const user = JSON.parse(remoteMessage.data.user);
                const image = user[0].image;
                const senderUid = JSON.parse(remoteMessage.data.uid);
                navigation.navigate('UserConnecting', { image, user, senderUid });
                //    return unsubscribe;
            } else {
                const connection = remoteMessage.data.connectionid
                console.log('connection=', connection);
                firestore()
                    .collection('Connection')
                    .doc(connection)
                    .onSnapshot(doc => {
                        // console.log('doc=', doc.data().responded);
                        if (doc.data().responded === 'true') {
                            // const receiver = remoteMessage.data.receiver;
                            navigation.navigate('PreviousListener');
                            //    return unsubscribe;
                        }
                    })
            }
            Alert.alert(
                JSON.stringify(remoteMessage.notification.title),
                JSON.stringify(remoteMessage.notification.body),
                // [
                //     {
                //         text: "Cancel",
                //         onPress: () => console.log("Cancel Pressed"),
                //         style: "cancel"
                //     },
                //     { text: "OK", onPress: () => console.log("OK Pressed") }
                // ]
            );
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
                    // resizeMode="contain"
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
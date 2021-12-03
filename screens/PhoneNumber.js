import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, Dimensions } from "react-native";

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import getMessaging from '@react-native-firebase/messaging';

import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';
import AsyncStorage from "@react-native-async-storage/async-storage";

import PushNotification from "react-native-push-notification";
import { LocalNotification } from "../src/services/LocalPushController";


import { signout } from "../auth/FireBase";
import { Images } from "../content/Images";
import Header from "../content/contacts/Header";
import Input from "../content/contacts/Input";
import Button from "../content/contacts/Button";
import Button1 from "../content/contacts/Button1";

const { height, width } = Dimensions.get('screen');
var fcmUnsubscribe = null;

const PhoneNumber = ({ navigation }) => {
    const [check, setCheck] = useState(false);
    const notification = (fcmToken, firstName, lastName, data) => {
        // console.log('not=', fcmToken);
        fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "key=AAAArc-UobE:APA91bEuxAzyQBJfkst1uSClNiWmre1tW5DOePJXMNFuXR7mu5a-8kl9eaMyk2tVLMGB3505YrQZN4634EdnQdW3rligTtQMRp30TsUVgwLh6VJJK-HvaMEXVLqZnNbGOT1ekitoNEPn"
            },
            body: JSON.stringify({
                "to": fcmToken,
                "notification": {
                    "title": [firstName] + [' '] + [lastName],
                    "body": "Friend request!",
                },
                "data": {
                    "type": "new-request",
                    "user": [data],
                },
                "mutable_content": false,
                "sound": "Tri-tone"
            }),
        }).then(() => {
            console.warn('sended');
            // console.log('data=', data);
            navigation.navigate('WaitingRoom');
        })
    }
    function generateUUID(digits) {
        let str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXZ';
        let uuid = [];
        for (let i = 0; i < digits; i++) {
            uuid.push(str[Math.floor(Math.random() * str.length)]);
        }
        return uuid.join('');
    }
    const handleNotification = async () => {
        let value = await AsyncStorage.getItem('uid');
        let parse = JSON.parse(value);
        // console.log('value=', parse.user.uid);
        let check = '';
        let token = '';
        let recieveData = '';
        let count = 0;
        let connectionId = generateUUID(32);
        firestore()
            .collection('Users')
            .doc(parse.user.uid)
            .get()
            .then(dat => {
                check = dat.data().interest.value;
                console.log('check=', check);
                token = dat.data().fcmtoken;
                recieveData = dat.data();
                // console.log('token=',data1.firstname);
            });
        firestore()
            .collection('Users')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    const data = documentSnapshot.data();
                    if ("interest" in data) {
                        if (data.interest.value === check && data.fcmtoken != token && data.fcmtoken != 'null') {
                            notification(data.fcmtoken, recieveData.firstname, recieveData.lastname, recieveData);
                            const rid = documentSnapshot.id;
                            // console.log('id=', id);
                            console.log('request=', data);
                            firestore()
                                .collection('Users')
                                .doc(parse.user.uid)
                                .update({
                                    connectionid: connectionId,
                                })
                                .then(() => {
                                    console.log('Connection added!');
                                    // navigation.navigate('WaitingRoom');
                                });
                            count++;
                            firestore()
                                .collection('Connection')
                                .doc(connectionId)
                                .set({
                                    createdBy: recieveData,
                                    responded: 'false',
                                    noofuser: count,
                                    createdAt: new Date(),
                                    otheruser: '',
                                })
                                .then(() => {
                                    console.log('Connection added!');
                                    const id = documentSnapshot.id;
                                    console.log('id=', id);
                                    console.log('request=', data);
                                    firestore()
                                        .collection('Users')
                                        .doc(id)
                                        .update({
                                            connectionid: connectionId,
                                        })
                                        .then(() => {
                                            console.log('Connection added!');
                                            // navigation.navigate('WaitingRoom');
                                        });
                                    // navigation.navigate('WaitingRoom');
                                });
                            // console.log('redata=',recieveData);
                            // console.log('token=',data.fcmtoken);
                            // console.log('count=',count);
                            // console.log('uid=',generateUUID(32));
                        }
                    }
                });
            });
    }
    const logOut = async () => {
        signout()
            .then((user) => {
                console.log(user);
                navigation.navigate('SignIn');
            })
    }
    return (
        <View>
            <Header title='Need a Listening Ear?' />
            <View style={styles.main}>
                <View
                    style={styles.image}
                >
                    <Image
                        source={Images.question}
                        resizeMode='contain'
                        style={styles.image1}
                    />
                </View>
            </View>
            <Text style={styles.text}>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</Text>
            {/* <Button title='Send out notification' onPress={() => navigation.navigate('Notification')} /> */}
            <Button title='Send out notification' onPress={handleNotification} />
            <Button1 title='Contact a previous listener' onPress={() => navigation.navigate('PreviousListener')} />
            <Button title='Log Out' onPress={logOut} />
            <Button title='Edit Profile' onPress={() => navigation.navigate('EditProfile')} />
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        marginVertical: h('4%')
    },
    image: {
        height: height * 0.14,
        width: height * 0.14,
        borderRadius: (height * 0.14) / 2,
        alignSelf: 'center',
        overflow: 'hidden',
        borderRadius: 50,
        backgroundColor: '#BFBFBF'
    },
    image1: {
        alignSelf: 'center',
        height: h('15%'),
        overflow: 'hidden',
    },
    view: {
        flexDirection: 'row',
        // alignItems: 'center',
        marginVertical: h('2%'),
        marginHorizontal: w('10%')
    },
    text: {
        color: '#BFBFBF',
        paddingHorizontal: w('16%'),
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
        textAlign: 'center',
        marginVertical: h('2%')
    },
});


export default PhoneNumber;
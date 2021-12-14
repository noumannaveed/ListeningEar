import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Dimensions, SafeAreaView } from "react-native";

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
// import firebase from '@react-native-firebase';

import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';
import AsyncStorage from "@react-native-async-storage/async-storage";

import PushNotification from "react-native-push-notification";
import { LocalNotification } from "../src/services/LocalPushController";

import { ActivityIndicator } from "react-native-paper";

import { signout } from "../auth/FireBase";
import { Images } from "../content/Images";
import Header from "../content/contacts/Header";
import Input from "../content/contacts/Input";
import Button from "../content/contacts/Button";
import Button1 from "../content/contacts/Button1";

const { height, width } = Dimensions.get('screen');

const PhoneNumber = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [notificationLoading, setNotificationLoading] = useState(false);
    const notification = (fcmToken, data, uid, connection) => {
        fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "key=AAAArc-UobE:APA91bEuxAzyQBJfkst1uSClNiWmre1tW5DOePJXMNFuXR7mu5a-8kl9eaMyk2tVLMGB3505YrQZN4634EdnQdW3rligTtQMRp30TsUVgwLh6VJJK-HvaMEXVLqZnNbGOT1ekitoNEPn"
            },
            body: JSON.stringify({
                "to": fcmToken,
                "notification": {
                    "title": data.firstname + [' '] + data.lastname,
                    "body": "Friend request!",
                },
                "data": {
                    "type": "new-request",
                    "user": [data],
                    "uid": [uid],
                    "connection": [connection],
                },
                "mutable_content": false,
                "sound": "Tri-tone"
            }),
        }).then(() => {
            console.warn('sended');
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
        setNotificationLoading(true);
        let value = await AsyncStorage.getItem('uid');
        let parse = JSON.parse(value);
        let check = '';
        let token = '';
        let receiveData = '';
        let uid = '';
        let count = 0;
        let connectionId = generateUUID(32);
        let connections = '';
        firestore()
            .collection('Users')
            .doc(parse.user.uid)
            .get()
            .then(dat => {
                check = dat.data().interest.value;
                token = dat.data().fcmtoken;
                receiveData = dat.data();
                uid = parse.user.uid;
                connections = dat.data().connection;
                // console.log('connections=', connections[0].receiverid);
            });
        firestore()
            .collection('Users')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    const data = documentSnapshot.data();
                    const id = documentSnapshot.id;
                    // console.log('connections=',connections);
                    let isCheck = false;
                    for (var i = 0; i < connections.length; i++) {
                        if (id === connections[i].receiverid || id === connections[i].senderid) {
                            isCheck = true;
                            // console.log('recieverid=', connections[i].recieverid);
                        } else {
                            isCheck = false;
                        }
                    }
                    console.log('check=', isCheck);
                    // console.log('c=', c);
                    if (isCheck === false) {
                        if ("interest" in data) {
                            // console.log('condition=', c);
                            if (data.interest.value === check && data.fcmtoken != token && data.fcmtoken != 'null') {
                                notification(data.fcmtoken, receiveData, uid, connectionId);
                                count++;
                                firestore()
                                .collection('Connection')
                                .doc(connectionId)
                                .set({
                                    responded: 'false',
                                    noofuser: count,
                                    createdAt: new Date(),
                                    // otheruser: '',
                                })
                                .then(() => {
                                    console.log('Connection added!');
                                });
                            }
                        }
                    }
                    console.log(count);
                });
            });
        setNotificationLoading(false);
    }
    const logOut = async () => {
        setIsLoading(true);
        signout()
            .then((user) => {
                console.log(user);
                navigation.navigate('SignIn');
                setIsLoading(false);
            })
    }
    return (
        <SafeAreaView>
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
                <View>
                    {notificationLoading ? (
                        <ActivityIndicator color='#FFC69B' animating={notificationLoading} />
                    ) : (
                        <Button title='Send out notification' onPress={handleNotification} />
                    )
                    }
                </View>
                <Button1 title='Contact a previous listener' onPress={() => navigation.navigate('PreviousListener')} />
                <View>
                    {isLoading ? (
                        <ActivityIndicator color='#FFC69B' animating={isLoading} />
                    ) : (
                        <Button title='Log Out' onPress={logOut} />
                    )
                    }
                </View>
                <Button title='Edit Profile' onPress={() => navigation.navigate('EditProfile')} />
            </View>
        </SafeAreaView>
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
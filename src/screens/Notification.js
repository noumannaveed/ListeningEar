import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Alert } from "react-native";

import DropDownPicker from "react-native-custom-dropdown";

import { Switch } from 'react-native-paper';
import { ActivityIndicator } from "react-native-paper";

import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';

import AsyncStorage from "@react-native-async-storage/async-storage";

import firestore from '@react-native-firebase/firestore';


import Header from "../components/header/Header";
import Button from "../components/buttons/Button";

const Notification = ({ navigation }) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [interest, setInterest] = useState('');
    const [items, setItems] = useState([
        { label: 'Entertainment', value: 'entertainment' },
        { label: 'Sports', value: 'sports' },
        { label: 'Travelling', value: 'travelling' },
        { label: 'Eating', value: 'eating' },
    ])
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

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
                connections = dat.data()?.connection;
            });
        firestore()
            .collection('Users')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                    const data = documentSnapshot.data();
                    const id = documentSnapshot.id;
                    let isCheck = false;
                    for (var i = 0; i < connections?.length; i++) {
                        if (id === connections[i].receiverid || id === connections[i].senderid) {
                            isCheck = true;
                        }
                    }
                    if (isCheck === false) {
                        if ("interest" in data) {
                            if (data.interest.value === interest.value && data.fcmtoken != token && data.fcmtoken != 'null') {
                                console.log('interest=', data.fcmtoken);
                                notification(data.fcmtoken, receiveData, uid, connectionId);
                                count++;
                                firestore()
                                    .collection('Connection')
                                    .doc(connectionId)
                                    .set({
                                        responded: 'false',
                                        noofuser: count,
                                        createdAt: new Date(),
                                    })
                                    .then(() => {
                                        console.log('Connection added!');
                                    });
                            }
                        }
                    }
                });
                if (count === 0) {
                    Alert.alert(
                        'No User Found!',
                        'Try Again!',
                    );
                }
            });
        setNotificationLoading(false);
    }
    return (
        <SafeAreaView>
            <View>
                <Header title='Need a Listening Ear?' onPress={() => navigation.goBack()} />
                <Text style={styles.text}>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</Text>
                <View style={styles.pick}>
                    <DropDownPicker
                        placeholder='Select one option here....'
                        placeholderStyle={{ color: '#8B8B8B' }}
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        onChangeItem={(interest) => setInterest(interest)}
                        style={styles.picker}
                        containerStyle={{ height: h('7%') }}
                        arrowColor='#8B8B8B'
                        itemStyle={{
                            justifyContent: 'flex-start',
                        }}
                        dropDownStyle={{
                            borderTopLeftRadius: 20, borderTopRightRadius: 20,
                            borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
                            backgroundColor: '#f5f5f5',
                        }}
                    />
                </View>
                <Switch
                    value={isSwitchOn}
                    onValueChange={onToggleSwitch}
                    color='#FFC69B'
                    style={styles.switch}
                />
                <Text style={styles.text1}>Enable for Notification</Text>
                <View>
                    {notificationLoading ? (
                        <ActivityIndicator color='#FFC69B' animating={notificationLoading} />
                    ) : (
                        <Button title='Submit' onPress={handleNotification} />
                    )
                    }
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    main: {
        marginVertical: h('4%')
    },
    image: {
        height: h('15%'),
        width: w('30%'),
        alignSelf: 'center',
        overflow: 'hidden',
        borderRadius: 55,
        backgroundColor: '#BFBFBF'
    },
    image1: {
        alignSelf: 'center',
        height: h('15%')
    },
    view: {
        flexDirection: 'row',
        // alignItems: 'center',
        marginVertical: h('2%'),
        marginHorizontal: w('10%')
    },
    text: {
        color: '#8B8B8B',
        paddingHorizontal: w('16%'),
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
        textAlign: 'center',
        marginVertical: h('5%'),
    },
    pick: {
        marginHorizontal: w('10%'),
        marginVertical: h('5%'),
    },
    picker: {
        borderTopLeftRadius: 50, borderTopRightRadius: 50,
        borderBottomLeftRadius: 50, borderBottomRightRadius: 50,
        borderColor: '#8B8B8B',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: w('3%'),
    },
    switch: {
        alignSelf: 'center',
        marginVertical: h('1%')
    },
    text1: {
        textAlign: 'center',
        fontFamily: 'Roboto-Bold',
        color: '#008AB6',
        marginVertical: h('1%'),
        fontSize: 18,
    },
});


export default Notification;
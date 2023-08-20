import React, { useState } from "react";
import { View, Text, StyleSheet, Dimensions, SafeAreaView, Alert } from "react-native";

import DropDownPicker from "react-native-custom-dropdown";

import { ActivityIndicator } from "react-native-paper";


import AsyncStorage from "@react-native-async-storage/async-storage";

import firestore from '@react-native-firebase/firestore';


import Header from "../components/header/Header";
import Button from "../components/buttons/Button";
const { height, width } = Dimensions.get('screen');
const Notification = ({ navigation }) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [gender, setGender] = useState('');
    const [race, setRace] = useState('')
    const [age, setAge] = useState('')
    const [story, setStory] = useState('')
    const [stories, setStories] = useState([
        { label: 'Quick question', value: 'quick question' },
        { label: 'Long story', value: 'long story' },
    ])
    const [genders, setGenders] = useState([
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Gay-Male', value: 'gay-Male' },
        { label: 'Gay-Female', value: 'gay-Female' },
        { label: 'Male identify as Female', value: 'male identify as Female' },
        { label: 'Female identify as Male', value: 'female identify as Male' },
    ]);
    const [races, setRaces] = useState([
        { label: 'Black', value: 'black' },
        { label: 'White', value: 'white' },
        { label: 'Asian', value: 'asian' },
        { label: 'Pacific Islander', value: 'pacific Islander' },
        { label: 'Hispanic Black', value: 'hispanic Black' },
        { label: 'Hispanic White', value: 'hispanic White' },
        { label: 'Indian', value: 'indian' },
        { label: 'Other', value: 'other' },
    ]);
    const [ages, setAges] = useState([
        { label: '13-18', value: '13-18' },
        { label: '18-25', value: '18-25' },
        { label: '25-35', value: '25-35' },
        { label: '35-50', value: '35-50' },
        { label: '50+', value: '50+' },
    ]);
    const [notificationLoading, setNotificationLoading] = useState(false);

    const notification = (fcmToken, data, uid, connection, story) => {
        console.log(fcmToken);
        fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "key=AAAAg16Jmto:APA91bH2DBbAekBeKvcpbqH8zC0g0xb3AM6_JdS8TPG2mhRAc6xUJW5lO-O_7pNDkce6f2qEwOEBNoSbHNkhVicKRBx22A6XP-tYjSsj37D2DfJ8RG1pG6SpioucqDPc6NOQrX9vFRbh"
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
                    "story": [story],
                },
                "mutable_content": false,
                "sound": "Tri-tone"
            }),
        }).then(() => {
            console.warn('sended');
            navigation.replace('WaitingRoom');
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
    const validate_field = () => {
        if (gender == '') {
            alert("Select Gender");
            return false;
        } else if (race == '') {
            alert("Select Race");
            return false;
        } else if (age == '') {
            alert("Select Age");
            return false;
        } else if (story == '') {
            alert("Select Story");
            return false;
        }
        return true;
    }
    const handleNotification = async () => {
        if (validate_field()) {
            setNotificationLoading(true);
            let value = await AsyncStorage.getItem('uid');
            let parse = JSON.parse(value);
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
                    token = dat.data().fcmtoken;
                    receiveData = dat.data();
                    uid = parse.user.uid;
                    connections = dat.data()?.connection;
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
                                    if (data.age.value === age.value && data.race.value === race.value && data.gender.value === gender.value && data.fcmtoken != token && data.fcmtoken != 'null' && data.enable === true) {
                                        notification(data.fcmtoken, receiveData, uid, connectionId, story);
                                        count++;
                                        firestore()
                                            .collection('Connection')
                                            .doc(connectionId)
                                            .set({
                                                responded: false,
                                                noofuser: count,
                                                createdAt: new Date(),
                                            })
                                            .then(() => {
                                                console.log('Connection added!');
                                            });
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
                });
            setNotificationLoading(false);
        }
    }
    return (
        <SafeAreaView>
            <View>
                <Header backIcon='chevron-back' backText='Back' title='Need a Listening Ear?' onPress={() => navigation.goBack()} />
                <Text style={styles.text}>Who would you like to listen to you?</Text>
                <View style={styles.pick}>
                    <DropDownPicker
                        placeholder='Gender....'
                        placeholderStyle={{ color: '#8B8B8B' }}
                        open={open}
                        value={value}
                        items={genders}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setGenders}
                        style={styles.picker}
                        containerStyle={{ height: height * 0.07 }}
                        arrowColor='#8B8B8B'
                        onChangeItem={(gender) => setGender(gender)}
                        itemStyle={{
                            justifyContent: 'flex-start',
                        }}
                        dropDownStyle={{
                            borderTopLeftRadius: 20, borderTopRightRadius: 20,
                            borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
                            backgroundColor: '#f5f5f5',
                        }}
                        activeLabelStyle={{ color: 'grey' }}
                        labelStyle={{
                            color: 'black'
                        }}
                    />
                </View>
                <View style={styles.pick}>
                    <DropDownPicker
                        placeholder='Race....'
                        placeholderStyle={{ color: '#8B8B8B' }}
                        open={open}
                        value={value}
                        items={races}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setRaces}
                        style={styles.picker}
                        containerStyle={{ height: height * 0.07 }}
                        arrowColor='#8B8B8B'
                        onChangeItem={(race) => setRace(race)}
                        itemStyle={{
                            justifyContent: 'flex-start',
                        }}
                        dropDownStyle={{
                            borderTopLeftRadius: 20, borderTopRightRadius: 20,
                            borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
                            backgroundColor: '#f5f5f5',
                        }}
                        activeLabelStyle={{ color: 'grey' }}
                        labelStyle={{
                            color: 'black'
                        }}
                    />
                </View>
                <View style={styles.pick}>
                    <DropDownPicker
                        placeholder='Age....'
                        placeholderStyle={{ color: '#8B8B8B' }}
                        open={open}
                        value={value}
                        items={ages}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setAges}
                        style={styles.picker}
                        containerStyle={{ height: height * 0.07 }}
                        arrowColor='#8B8B8B'
                        onChangeItem={(age) => setAge(age)}
                        itemStyle={{
                            justifyContent: 'flex-start',
                        }}
                        dropDownStyle={{
                            borderTopLeftRadius: 20, borderTopRightRadius: 20,
                            borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
                            backgroundColor: '#f5f5f5',
                        }}
                        activeLabelStyle={{ color: 'grey' }}
                        labelStyle={{
                            color: 'black'
                        }}
                    />
                </View>
                <View style={styles.pick}>
                    <DropDownPicker
                        placeholder='Story....'
                        placeholderStyle={{ color: '#8B8B8B' }}
                        open={open}
                        value={value}
                        items={stories}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setStories}
                        style={styles.picker}
                        containerStyle={{ height: height * 0.07 }}
                        arrowColor='#8B8B8B'
                        onChangeItem={(story) => setStory(story)}
                        itemStyle={{
                            justifyContent: 'flex-start',
                        }}
                        dropDownStyle={{
                            borderTopLeftRadius: 20, borderTopRightRadius: 20,
                            borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
                            backgroundColor: '#f5f5f5',
                        }}
                        activeLabelStyle={{ color: 'grey' }}
                        labelStyle={{
                            color: 'black'
                        }}
                    />
                </View>
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
    text: {
        color: '#8B8B8B',
        paddingHorizontal: width * 0.16,
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
        textAlign: 'center',
        marginVertical: height * 0.05,
    },
    pick: {
        marginHorizontal: width * 0.1,
        marginVertical: height * 0.01,
    },
    picker: {
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        borderColor: '#8B8B8B',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: width * 0.03,
    },
});


export default Notification;
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground } from "react-native";

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';
import AsyncStorage from "@react-native-async-storage/async-storage";

import PushNotification from "react-native-push-notification";


import { signout } from "../auth/FireBase";
import { Images } from "../content/Images";
import Header from "../content/contacts/Header";
import Input from "../content/contacts/Input";
import Button from "../content/contacts/Button";
import Button1 from "../content/contacts/Button1";

const PhoneNumber = ({ navigation }) => {
    const handleNotification = () => {
        PushNotification.localNotification({
            channelId:"test-channel",
            title:"You Clicked",
            message:"how are you",
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
            <Header title='Need a Listening Ear?' onPress={() => navigation.goBack()} />
            <View style={styles.main}>
                <ImageBackground
                    style={styles.image}
                >
                    <Image
                        source={Images.question}
                        resizeMode='contain'
                        style={styles.image1}
                    />
                </ImageBackground>
            </View>
            <Text style={styles.text}>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</Text>
            {/* <Button title='Send out notification' onPress={() => navigation.navigate('Notification')} /> */}
            <Button title='Send out notification' onPress={() => {handleNotification()}} />
            <Button1 title='Contact a previous listener' onPress={() => navigation.navigate('PreviousListener')} />
            <Button title='Log Out' onPress={logOut} />
            <Button title='Edit Profile' onPress={()=>navigation.navigate('EditProfile')}/>
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        marginVertical: h('4%')
    },
    image: {
        height: h('15%'),
        width: w('26%'),
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
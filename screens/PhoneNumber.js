import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, Dimensions } from "react-native";

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

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
    const handleNotification = () => {
        firestore()
        .collection('Users')
        .get()
        .then(querySnapshot => {
          console.log('Total users: ', querySnapshot.size);
      
          querySnapshot.forEach(documentSnapshot => {
              const data = documentSnapshot.data();
              if ("interest" in data) {
                // console.log('User ID: ', documentSnapshot.id, data.interest.value); 
                if (data.interest.value === 'apple') {
                    console.log('apple=',data.fcmtoken);
                    // LocalNotification(data.fcmtoken);
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
            <Header title='Need a Listening Ear?' onPress={() => navigation.goBack()} />
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
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
                        <Button title='Send out notification' onPress={() => navigation.navigate('Notification')} />
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
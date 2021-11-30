import React, { useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import storage from '@react-native-firebase/storage';
export const signout = async () => {
    let value = await AsyncStorage.getItem('uid');
    let parse = JSON.parse(value);
    console.log('value=', parse.user.uid);
    firestore()
        .collection('Users')
        .doc(parse.user.uid)
        .update({
            fcmtoken: 'null',
        })
        .then(() => {
            console.log('token deleted');
        });
    return new Promise((resolve, reject) => {
        auth()
            .signOut()
            .then(async () => {
                await AsyncStorage.clear();
                console.log('User signed out!');
                resolve({ status: true })
            })
            .catch(error => {
                reject({ status: false })
            })
    })
};
export const login = async (email, password, setIsLoading) => {
    const fcmToken = await messaging().getToken();
    console.log('Token=',fcmToken);
    setIsLoading(true);
    return new Promise((resolve, reject) => {
        auth()
            .signInWithEmailAndPassword(email, password)
            .then(async (user) => {
                try {
                    await AsyncStorage.setItem(
                        'uid',
                        JSON.stringify(user)
                    );
                } catch (error) {
                    // Error saving data
                }
                firestore()
                    .collection('Users')
                    .doc(user.user.uid)
                    .update({
                        fcmtoken: fcmToken,
                    })
                    .then(() => {
                        console.log('token update');
                    });
                console.log('User account created & signed in!');
                setIsLoading(false);
                resolve({ status: true, user: user });
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    setIsLoading(false);
                    console.log('That email address is already in use!');
                    reject({ status: false, error: "That email address is already in use!" });
                }
                if (error.code === 'auth/invalid-email') {
                    setIsLoading(false);
                    console.log('That email address is invalid!');
                    reject({ status: false, error: "That email address is invalid!" });
                }
                if (error.code === 'auth/user-not-found') {
                    setIsLoading(false);
                    console.log('That email address is invalid!');
                    reject({ status: false, error: "That email address is invalid!" });
                }
                if (error.code === 'auth/wrong-password') {
                    setIsLoading(false);
                    console.log('That email address is invalid!');
                    reject({ status: false, error: "Wrong password!" });
                }
            });
    })
};
export const signup = async (email, password, firstName, lastName, image, interest) => {
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
    console.log('image1=',filename);
    try {
        await storage().ref(filename).putFile(uploadUri);
        console.log('upload=', uploadUri);
    } catch (error) {
        console.log('error=', error);
    }
    const url = await storage().ref(filename).getDownloadURL();
    const fcmToken = await messaging().getToken();
    console.log('url=',url);
    return new Promise((resolve) => {
        auth()
            .createUserWithEmailAndPassword(email, password)
            .then(async (user) => {
                try {
                    await AsyncStorage.setItem(
                        'uid',
                        JSON.stringify(user),
                    );
                } catch (error) {
                    // Error saving data
                }
                firestore()
                    .collection('Users')
                    .doc(user.user.uid)
                    .set({
                        firstname: firstName,
                        lastname: lastName,
                        email: email,
                        image: url,
                        interest: interest,
                        fcmtoken: fcmToken,
                    })
                    .then(() => {
                        console.log('User added!');
                    });
                console.log('uid=', user.user.uid);
                resolve({ status: true, user: user });
            })
            .catch(error => {
                if (error.code === '[storage/unauthorized]') {
                    console.log('That email address is already in use!');
                    reject({ status: false, error: "That email address is already in use!" });
                }
            });
    })
};
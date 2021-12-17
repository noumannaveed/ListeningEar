import React from "react";
import { View, Text, Image, StyleSheet, SafeAreaView, ImageBackground, Dimensions } from "react-native";

import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';

import AsyncStorage from "@react-native-async-storage/async-storage";

import firestore from '@react-native-firebase/firestore';

import Button from "../content/contacts/Button";
import Button1 from "../content/contacts/Button1";
import Header from "../content/contacts/Header";

import { Images } from "../content/Images";

const { height, width } = Dimensions.get('screen');
const UserConnecting = ({ navigation, route }) => {
    const image = route.params.image;
    const user = route.params.user;
    const senderUid = route.params.senderUid;
    const connectionId = route.params.connectionid;
    let senderFcmToken = '';
    let id = '';
    let type = '';
    let title = '';
    let body = '';
    const notification = async (fcmToken, type, title, body, id) => {
        fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "key=AAAArc-UobE:APA91bEuxAzyQBJfkst1uSClNiWmre1tW5DOePJXMNFuXR7mu5a-8kl9eaMyk2tVLMGB3505YrQZN4634EdnQdW3rligTtQMRp30TsUVgwLh6VJJK-HvaMEXVLqZnNbGOT1ekitoNEPn"
            },
            body: JSON.stringify({
                "to": fcmToken,
                "notification": {
                    "title": title,
                    "body": body,
                },
                "data": {
                    "type": type,
                    "connectionid": id,
                },
                "mutable_content": false,
                "sound": "Tri-tone"
            }),
        }).then(() => {
            console.warn('sended');
            // console.log('data=', data);
            navigation.navigate('PreviousListener');
        })
    }
    const accept = async () => {
        let value = await AsyncStorage.getItem('uid');
        let parse = JSON.parse(value);
        const sender = { connectionid: connectionId, senderid: senderUid[0] }
        const receiver = { connectionid: connectionId, receiverid: parse.user.uid }
        firestore()
            .collection('Users')
            .doc(parse.user.uid)
            .update({
                responded: 'true',
                connection: firestore.FieldValue.arrayUnion(sender),
            })
            .then(() => {
                firestore()
                    .collection('Users')
                    .doc(parse.user.uid)
                    .get()
                    .then(data => {
                        const otherUser = data.data();
                        const receiverId = data.id;
                        firestore()
                            .collection('Users')
                            .doc(senderUid[0])
                            .update({
                                connection: firestore.FieldValue.arrayUnion(receiver),
                            })
                            .then(() => {
                                firestore()
                                    .collection('Users')
                                    .doc(senderUid[0])
                                    .get()
                                    .then(documentsnapshot => {
                                        senderFcmToken = documentsnapshot.data().fcmtoken;
                                        const send = documentsnapshot.data();
                                        notification(senderFcmToken, type = 'request-accepted', title = 'accepted', body = 'Friend request!', connectionId);
                                        // console.log('Sender=', senderFcmToken);
                                        firestore()
                                            .collection('Connection')
                                            .doc(connectionId)
                                            .update({
                                                createdBy: send,
                                                otheruser: otherUser,
                                                receiverid: receiverId,
                                                senderid: senderUid[0],
                                                responded: 'true',
                                            })
                                            .then(() => {
                                                console.log('other user added!');
                                            })
                                    })
                            })

                    })

            });
    }
    const reject = () => {
        firestore()
            .collection('Connection')
            .doc(connectionId)
            .delete()
            .then(() => {
                firestore()
                    .collection('Users')
                    .doc(senderUid[0])
                    .get()
                    .then(documentsnapshot => {
                        senderFcmToken = documentsnapshot.data().fcmtoken
                        navigation.navigate('PreviousListener')
                        notification(senderFcmToken, type = 'request-rejected', title = 'rejected', body = 'No user available', connectionId)
                    })
            })
    }
    return (
        <SafeAreaView>
            <View>
                <Header title='Waiting Room' onPress={() => navigation.goBack()} />
                <Text style={styles.text1}>Someone would like to speak to you</Text>
                <ImageBackground style={styles.black} source={Images.wifi} resizeMode="contain">
                    <Image
                        style={styles.Ellipse}
                        source={{ uri: image }}
                    // resizeMode="contain"
                    />
                </ImageBackground>
                <Text style={styles.text2}>Are you available to listen and provide positive feedback?</Text>
                <ImageBackground
                    source={Images.sound_wave}
                    // resizeMode="contain"
                    style={styles.wave}
                >
                    <View style={styles.buttonView}>
                        <Button title='Yes' onPress={accept} style={styles.button} />
                        <Button1 title='No' onPress={reject} style={styles.button1} />
                    </View>
                </ImageBackground>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    text1: {
        color: '#008AB6',
        textAlign: 'center',
        fontSize: 37,
        fontFamily: 'Roboto-Regular',
        margin: '5%',
    },
    text2: {
        color: 'black',
        textAlign: 'center',
        fontSize: 27,
        fontFamily: 'Roboto-Regular',
        marginHorizontal: w('5%'),
    },
    black: {
        height: height * 0.20,
        width: height * 0.20,
        alignSelf: 'center',
        overflow: 'hidden',
    },
    Ellipse: {
        alignSelf: 'center',
        height: height * 0.15,
        width: height * 0.15,
        borderRadius: (height * 0.15) / 2,

        // borderWidth: 1,
        // borderColor: 'black'
    },
    wave: {
        height: height * 0.4,
        width: width * 1,
        // alignSelf: 'center',
        overflow: 'hidden',
        // position: 'absolute',
        // bottom: '20%',
        // width: w('100%'),
    },
    buttonView: {
        bottom: h('14%'),
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginHorizontal: w('19%'),
    },
    button: {
        paddingHorizontal: w('10%'),
    },
    button1: {
        color: 'white',
        paddingHorizontal: w('10%'),
    },
});

export default UserConnecting;
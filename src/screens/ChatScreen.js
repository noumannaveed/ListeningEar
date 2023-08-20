import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat, Bubble, InputToolbar, Time } from 'react-native-gifted-chat'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, SafeAreaView, Keyboard, TouchableWithoutFeedback } from "react-native";
import ChatHeader from "../components/header/ChatHeader";
import firestore from '@react-native-firebase/firestore';
import { FirebaseIncomingThread } from './../auth/FireBase'
import { sendMessage } from '../auth/FireBase';

const ChatScreen = ({ navigation, route }) => {
    const name = route.params.userName
    const image = route.params.image
    const userUid = route.params.userId
    const connection = route.params.connection
    const fcmtoken = route.params.token
    const OtherUser = {
        firstname: route.params.userName,
        image: route.params.image,
        id: route.params.userId,
        fcmToken: route.params.token
    }
    const [messages, setMessages] = useState([])
    const [isCalling, setIsCalling] = useState(false)
    const [currentUser, setCurrent] = useState(null)


    let type = ''
    const notification = async (fcmToken, title, body, type, callDetails) => {
        let data
        if (type === "IncomingCall") {
            data = {
                "type": type,
                "call": callDetails
            }
        } else {
            data = {
                "type": type,
            }
        }
        fetch('https://fcm.googleapis.com/fcm/send', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "key=AAAAg16Jmto:APA91bH2DBbAekBeKvcpbqH8zC0g0xb3AM6_JdS8TPG2mhRAc6xUJW5lO-O_7pNDkce6f2qEwOEBNoSbHNkhVicKRBx22A6XP-tYjSsj37D2DfJ8RG1pG6SpioucqDPc6NOQrX9vFRbh"
            },
            body: JSON.stringify({
                "to": fcmToken,
                "notification": {
                    "title": title,
                    "body": body,
                },
                "data": data,
                "mutable_content": false,
                "sound": "Tri-tone"
            }),
        }).then(() => {
            if (type === "IncomingCall") {
                navigation.navigate("CallScreen", { user: OtherUser, type: "OutGoing" })
            }
            console.warn('sended');
        })
    }
    const createFirebaseIncomingThread = () => {

        FirebaseIncomingThread(userUid, "mychan", currentUser)
            .then((res) => {
                let callDetails = {
                    channelName: "mychan",
                    user: currentUser
                }
                notification(fcmtoken, "Incoming Call from " + currentUser?.firstname, "Audio call", "IncomingCall", callDetails)
            })
            .catch(() => {
            })
    }
    useEffect(async () => {
        let user = await AsyncStorage.getItem('user', null)
        if (user != null) {
            console.log(user)
            let json = JSON.parse(user)
            setCurrent(json)
        }
        const messageRef = firestore()
            .collection('Connection')
            .doc(connection)
            .collection('Messages')
            .orderBy('createdAt', 'desc')
        messageRef.onSnapshot((querySnap) => {
            const allmsg = querySnap.docs.map(docSnap => {
                const data = docSnap.data()
                if (data.createdAt) {
                    return {
                        ...docSnap.data(),
                        createdAt: docSnap.data().createdAt.toDate()
                    }
                } else {
                    return {
                        ...docSnap.data(),
                        createdAt: new Date()
                    }
                }
            })
            setMessages(allmsg)
        })
    }, [navigation])

    const onSend = useCallback(async (messageArray) => {
        const msg = messageArray[0]
        const mymsg = {
            ...msg,
            createdAt: new Date(),
            user: {
                _id: userUid,
                name: name,
                avatar: image,
            },
        }
        setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg))
        sendMessage(connection, mymsg)
        notification(fcmtoken, name, mymsg.text, type = 'new-message')
    }, [])
    // if (isCalling) {
    //     return (
    //         <AudioCallScreen
    //             otherUser={OtherUser}
    //             onCancel={() => {
    //                 setIsCalling(false)
    //                 notification(fcmtoken, "Incoming Call Canceled from " + currentUser?.firstname, "Audio call", "CancelCall")

    //             }}
    //             navigation={navigation}
    //             // onCancel={()=>{
    //             //     notification(fcmtoken, "Incoming Call Canceled from " + currentUser?.firstname, "Audio call", "CancelCall",callDetails)
    //             // }}
    //         />
    //     )
    // }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
                    <ChatHeader
                        backIcon='chevron-back'
                        backText='Back'
                        title={name}
                        onPress={() => navigation.goBack()}
                        icon="phone"
                        onPressVideo={async () => {
                            // let user = await AsyncStorage.getItem('user', null)
                            // if (user != null) {
                            //     console.log(user)
                            //     let json = JSON.parse(user)
                            //     setCurrent(json)
                            // }
                            // console.log(currentUser);
                            navigation.navigate("CallScreen", { user: OtherUser, type: "OutGoing", CUser: currentUser })
                            // let callDetails = {
                            //     channelName: "mychan",
                            //     user: currentUser
                            // }
                            // createFirebaseIncomingThread()
                            // notification(fcmtoken, "Incoming Call from " + currentUser?.firstname, "Audio call", "IncomingCall", callDetails)
                            // setIsCalling(true)
                        }}
                    />
                    <GiftedChat
                        messages={messages}
                        onSend={messages => onSend(messages)}
                        user={{
                            _id: userUid,
                        }}
                        renderBubble={(props) => {
                            return <Bubble
                                {...props}
                                wrapperStyle={{
                                    right: {
                                        backgroundColor: "#FFC69B",
                                    }
                                }}
                                textStyle={{
                                    right: {
                                        color: 'black',
                                    }
                                }}
                            />
                        }}
                        renderTime={(props) => {
                            return <Time
                                {...props}
                                timeTextStyle={{
                                    right: {
                                        color: 'black',
                                    },
                                }}
                            />
                        }}
                        renderInputToolbar={(props) => {
                            return <InputToolbar
                                {...props}
                                containerStyle={{
                                    borderTopWidth: 1.5,
                                    borderTopColor: "#FFC69B"
                                }}
                            />
                        }}
                    />
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

export default ChatScreen; 
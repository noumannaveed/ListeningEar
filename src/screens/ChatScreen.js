import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat, Bubble, InputToolbar, Time } from 'react-native-gifted-chat'

import { View, SafeAreaView, Keyboard, TouchableWithoutFeedback } from "react-native";
import Header from "../components/header/Header";

import firestore from '@react-native-firebase/firestore';

import { sendMessage } from '../auth/FireBase';

const ChatScreen = ({ navigation, route }) => {
    const name = route.params.userName
    const image = route.params.image
    const userUid = route.params.userId
    const connection = route.params.connection
    const fcmtoken = route.params.token
    console.log(fcmtoken);
    const [messages, setMessages] = useState([])
    let type = ''
    const notification = async (fcmToken, title, body, type) => {
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
                },
                "mutable_content": false,
                "sound": "Tri-tone"
            }),
        }).then(() => {
            console.warn('sended');
        })
    }
    useEffect(() => {
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
    }, [])

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
        console.log('mymsg=', mymsg);
        setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg))
        sendMessage(connection, mymsg)
        notification(fcmtoken, name, mymsg.text, type = 'new-message')
    }, [])

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
                    <Header 
                    title={name} 
                    onPress={() => navigation.goBack()}
                     icon="md-videocam" 
                     onPressVideo={()=>{
                         
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
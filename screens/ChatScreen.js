import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat, Bubble, InputToolbar, Time } from 'react-native-gifted-chat'

import { View, Text } from "react-native";
import Header from "../content/contacts/Header";

import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from '@react-native-firebase/firestore';

import { sendMessage } from '../auth/FireBase';


const ChatScreen = ({ navigation, route }) => {
    const name = route.params.userName
    const image = route.params.image
    const userUid = route.params.userId
    const [user, setUser] = useState('')
    const id = route.params.parse
    const connection = route.params.connection
    const [userImage, setUserImage] = useState('')
    let connectionid = ''
    console.log('sendto', userUid)
    const [messages, setMessages] = useState([])
    const getAllMessages = async () => {
        const querySnap = await firestore()
            .collection('Connection')
            .doc(connection)
            .collection('Messages')
            .orderBy('createdAt', 'asc')
            .get()
        const allmsg = querySnap.docs.map(docSnap => {
            return {
                ...docSnap.data(),
                createdAt: docSnap.data().createdAt.toDate()
            }
        })
        setMessages(allmsg)
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
        let value = await AsyncStorage.getItem('uid')
        let parse = JSON.parse(value)
        firestore()
            .collection('Users')
            .doc(parse.user.uid)
            .get()
            .then(doc => {
                setUserImage(doc.data().image)
            })
        // console.log('mymsg=', messageArray);
        const msg = messageArray[0]
        const mymsg = {
            ...msg,
            createdAt: new Date(),
            user: {
                _id: userUid,
                name: 'React Native',
                avatar: image,
            },
        }
        console.log('mymsg=', mymsg);
        setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg))
        sendMessage(connection, mymsg)
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <Header title={name} onPress={() => navigation.goBack()} />
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
                renderTime = {(props) => {
                    return (
                      <Time
                      {...props}
                        timeTextStyle={{
                          right: {
                            color: 'black',
                          },
                        }}
                      />
                    );
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
    )
}

export default ChatScreen; 9
import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'

import { View, Text } from "react-native";
import Header from "../content/contacts/Header";

import AsyncStorage from "@react-native-async-storage/async-storage";


const ChatScreen = ({ navigation, route }) => {
    const name = route.params.userName
    const image = route.params.image
    const userUid = route.params.userId
    const [user, setUser] = useState('')
    console.log('sendto', userUid)
    const [messages, setMessages] = useState([])
    const getUserId = async () => {
        let value = await AsyncStorage.getItem('uid')
        let parse = JSON.parse(value)
        setUser(parse.user.uid)
        setMessages([
            {
                text: 'Hello developer',
                createdAt: new Date(),
                user: {
                    _id: parse.user.uid,
                    name: 'React Native',
                    avatar: image,
                },
            },
        ])
    }
    useEffect(async () => {
        getUserId()
        
        console.log('sendby', user)
    }, [])

    const onSend = useCallback((messageArray) => {
        const msg = messageArray[0]
        const mymsg = {
            ...msg,
            sentBy: user,
            sentTo: userUid,
            createdAt: new Date(),
        }
        setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg))
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <Header title={name} onPress={() => navigation.goBack()} />
            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: user,
                }}
            />
        </View>
    )
}

export default ChatScreen;
import React, { Component } from "react";
import { View, StyleSheet, FlatList, SafeAreaView, Dimensions } from "react-native";


import AsyncStorage from '@react-native-async-storage/async-storage';

import firestore from '@react-native-firebase/firestore';

import Header from "../components/header/Header";
import Listen from "../components/listen/Listen";

import moment from "moment";

import { ActivityIndicator } from "react-native-paper";

const { height, width } = Dimensions.get('screen');

export default class PreviousListener extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userList: [],
            loading: false,
        };
    }
    removeDuplicate() {
        console.log("++++++++");
        const newArrayList = [];
        this.state.userList.forEach(obj => {
            if (!newArrayList.some(o => o.firstname === obj.firstname)) {
                newArrayList.push({ ...obj });
            }
        });
        this.setState({ userList: newArrayList });
    }
    getUser = async () => {
        let temp = [];
        let value = await AsyncStorage.getItem('uid');
        let parse = JSON.parse(value);
        let messages = [];
        let last = ''
        let second = ''
        this.setState({ userList: [] })
        firestore()
            .collection('Users')
            .doc(parse.user.uid)
            .get()
            .then(data => {
                for (var i = 0; i < data.data()?.connection?.length; i++) {
                    let connectionid = data.data().connection[i].connectionid
                    firestore()
                        .collection('Connection')
                        .doc(data.data().connection[i].connectionid)
                        .get()
                        .then(document => {
                            if (parse.user.uid === document.data()?.senderid) {
                                firestore()
                                    .collection('Users')
                                    .doc(document.data().receiverid)
                                    .get()
                                    .then(doc => {
                                        firestore()
                                            .collection('Connection')
                                            .doc(connectionid)
                                            .onSnapshot(sub => {
                                                if (sub.data().lastMessage) {
                                                    if (sub.data().lastMessage.createdAt !== null) {
                                                        last = moment(sub.data().lastMessage.createdAt.toDate(), "YYYYMMDD").fromNow()
                                                        second = sub.data().lastMessage.createdAt.seconds
                                                        console.log('temp=', sub.data().lastMessage.createdAt.seconds);
                                                    }
                                                    temp.push({
                                                        ...doc.data(),
                                                        uid: doc.id,
                                                        connection: connectionid,
                                                        message: sub.data().lastMessage.text,
                                                        time: last,
                                                        date: second
                                                    });
                                                    this.setState({ userList: temp });
                                                    this.removeDuplicate()
                                                } else {
                                                    temp.push({
                                                        ...doc.data(),
                                                        uid: doc.id,
                                                        connection: connectionid,
                                                    });
                                                    this.setState({ userList: temp });
                                                    this.removeDuplicate()
                                                }
                                            });
                                    })
                            } else if (parse.user.uid === document.data()?.receiverid) {
                                firestore()
                                    .collection('Users')
                                    .doc(document.data().senderid)
                                    .get()
                                    .then(doc => {
                                        firestore()
                                            .collection('Connection')
                                            .doc(connectionid)
                                            .onSnapshot(sub => {
                                                if (sub.data().lastMessage) {
                                                    if (sub.data().lastMessage.createdAt !== null) {
                                                        last = moment(sub.data().lastMessage.createdAt.toDate(), "YYYYMMDD").fromNow()
                                                        second = sub.data().lastMessage.createdAt.seconds
                                                        console.log('temp=', sub.data().lastMessage.createdAt.seconds);
                                                    }
                                                    temp.push({
                                                        ...doc.data(),
                                                        uid: doc.id,
                                                        connection: connectionid,
                                                        message: sub.data().lastMessage.text,
                                                        time: last,
                                                        date: second
                                                    });
                                                    this.setState({ userList: temp });
                                                    this.removeDuplicate()
                                                } else {
                                                    temp.push({
                                                        ...doc.data(),
                                                        uid: doc.id,
                                                        connection: connectionid,
                                                    });
                                                    this.setState({ userList: temp });
                                                    this.removeDuplicate()
                                                }
                                            });
                                    })
                            }
                        })
                }
            })
    }
    async componentDidMount() {
        this.setState({ loading: true });
        await this.getUser();
        this.setState({ loading: false });
    }
    renderItem = ({ item }) => (
        <Listen
            name={item.firstname}
            source={item.image}
            message={item.message}
            time={item.time}
            onPress={() => this.props.navigation.navigate('ChatScreen', { userName: item.firstname, image: item.image, userId: item.uid, parse: item.parse, connection: item.connection, token: item.fcmtoken })}
        />
    );
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <Header title='Need a Listening Ear?' onPress={() => this.props.navigation.goBack()} />
                    <View>
                        {this.state.loading ? (
                            <View style={styles.loading}>
                                <ActivityIndicator
                                    color='#FFC69B'
                                    animating={this.state.loading}
                                    size='large'
                                />
                            </View>
                        ) : (
                            <FlatList
                                data={this.state.userList.sort(function (a, b) {
                                    return new Date(b.date) - new Date(a.date);
                                })}
                                renderItem={this.renderItem}
                                style={{ marginTop: '1%' }}
                            />
                        )
                        }
                    </View>
                </View>
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({
    loading: {
        alignItems: 'center',
        justifyContent: "center",
        marginVertical: height * 0.375
    }
});

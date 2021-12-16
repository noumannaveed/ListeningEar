import React, { Component } from "react";
import { View, StyleSheet, FlatList, SafeAreaView, Dimensions } from "react-native";


import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

import firestore from '@react-native-firebase/firestore';

import Header from "../content/contacts/Header";
import Listen from "../content/contacts/Listen";
import { Images } from "../content/Images";

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
    getUser = async () => {
        let temp = [];
        let value = await AsyncStorage.getItem('uid');
        let parse = JSON.parse(value);
        console.log('parse=', parse.user.uid);
        firestore()
            .collection('Users')
            .doc(parse.user.uid)
            .get()
            .then(data => {
                console.log('value=', data.data().connection.length);
                for (var i = 0; i < data.data().connection.length; i++) {
                    console.log('connectionids=', data.data().connection[i].connectionid)
                    let connectionid = data.data().connection[i].connectionid
                    firestore()
                        .collection('Connection')
                        .doc(data.data().connection[i].connectionid)
                        .get()
                        .then(document => {
                            if (parse.user.uid === document.data().senderid) {
                                console.log('you are sender!', parse.user.uid);
                                firestore()
                                    .collection('Users')
                                    .doc(document.data().receiverid)
                                    .get()
                                    .then(doc => {
                                        temp.push({
                                            ...doc.data(),
                                            uid: doc.id,
                                            connection: connectionid,
                                        });
                                        this.setState({ userList: temp });
                                        console.log('tempreceiveruser=', temp);
                                    })
                            } else if (parse.user.uid === document.data().receiverid) {
                                console.log('you are receiver!', parse.user.uid);
                                firestore()
                                    .collection('Users')
                                    .doc(document.data().senderid)
                                    .get()
                                    .then(doc => {
                                        temp.push({
                                            ...doc.data(),
                                            uid: doc.id,
                                            connection: connectionid,
                                        });
                                        this.setState({ userList: temp });
                                        console.log('tempsenderuser=', temp);
                                    })
                            }
                        })
                }
            })
    }
    async componentDidMount() {
        this.setState({ loading: true });
        await this.getUser();
        // console.log('uid=',item.uid);
        this.setState({ loading: false });
    }
    renderItem = ({ item }) => (
        <Listen
            name={item.firstname}
            source={item.image}
            onPress={() => this.props.navigation.navigate('ChatScreen', { userName: item.firstname, image: item.image, userId: item.uid, parse: item.parse, connection: item.connection, token: item.fcmtoken })}
            // onPress={() => console.log(item.fcmtoken)}
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
                                data={this.state.userList}
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

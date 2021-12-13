import React, { Component } from "react";
import { View, StyleSheet, FlatList, SafeAreaView } from "react-native";


import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

import firestore from '@react-native-firebase/firestore';

import Header from "../content/contacts/Header";
import Listen from "../content/contacts/Listen";
import { Images } from "../content/Images";

import { ActivityIndicator } from "react-native-paper";

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
                    console.log('connectionids=', data.data().connection[i]);
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
                                        temp.push(doc.data());
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
                                        temp.push(doc.data());
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
        this.setState({ loading: false });
    }
    renderItem = ({ item }) => (
        <Listen
            name={item.firstname}
            source={item.image}
        />
    );
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                {console.log('userList=', this.state.userList)}
                <View style={{ flex: 1 }}>
                    <Header title='Need a Listening Ear?' onPress={() => this.props.navigation.goBack()} />
                    <View>
                        {this.state.loading ? (
                            <ActivityIndicator color='#FFC69B' animating={this.state.loading} />
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

});

import React, { useState, Component } from "react";
import { View, StyleSheet, FlatList, SafeAreaView } from "react-native";


import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

import firestore from '@react-native-firebase/firestore';

import Header from "../content/contacts/Header";
import Listen from "../content/contacts/Listen";
import { Images } from "../content/Images";

const DATA = [
    {
        id: 1,
        name: "Darren",
        source: Images.profile1
    },
    {
        id: 2,
        name: "Lisa",
        source: Images.profile
    },
    {
        id: 3,
        name: "Sammy",
        source: Images.profile
    },
    {
        id: 4,
        name: "Paul",
        source: Images.profile
    },
    {
        id: 5,
        name: "Michale",
        source: Images.profile
    },
    {
        id: 6,
        name: "Daren",
        source: Images.profile
    },
    {
        id: 7,
        name: "Smith",
        source: Images.profile
    },
    {
        id: 8,
        name: "Hyden",
        source: Images.profile
    },
    {
        id: 9,
        name: "Simmons",
        source: Images.profile
    },
    {
        id: 10,
        name: "Wonder",
        source: Images.profile
    },
    {
        id: 11,
        name: "Darren",
        source: Images.profile1
    },
];
const userList = [];
export default class PreviousListener extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userList: DATA,
        };
    }
    getUser = async () => {
        let value = await AsyncStorage.getItem('uid');
        let parse = JSON.parse(value);
        // console.log('parse=', parse.user.uid);
        firestore()
            .collection('Users')
            .doc(parse.user.uid)
            .get()
            .then(data => {
                // console.log('data=', data.data().connectionid);
                firestore()
                .collection('Connection')
                .doc(data.data().connectionid)
                .get()
                .then(data=>{
                    // console.log('connectiondata=',data.data().receiverid);
                    if (parse.user.uid===data.data().senderid) {
                        console.log('you are sender!',parse.user.uid);
                    } else if (parse.user.uid===data.data().receiverid) {
                        console.log('you are receiver!',parse.user.uid);
                    }
                })
            })
    }
    async componentDidMount() {
        await this.getUser();
    }
    renderItem = ({ item }) => (
        <Listen
            name={item.name}
            source={item.source}
        />
    );
    render() {
        return (
            <SafeAreaView>
                <View>
                    <Header title='Need a Listening Ear?' onPress={() => this.props.navigation.goBack()} />
                    <FlatList
                        data={this.state.userList}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.id}
                        style={{ marginBottom: '26%', marginTop: '1%' }}
                    />
                </View>
            </SafeAreaView>
        );
    }
};

const styles = StyleSheet.create({

});

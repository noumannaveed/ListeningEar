import React, {useState} from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, FlatList } from "react-native";


import {widthPercentageToDP as w, heightPercentageToDP as h} from 'react-native-responsive-screen';


import Header from "../content/contacts/Header";
import Listen from "../content/contacts/Listen";
import { Images } from "../content/Images";

const DATA = [
    {
        id: 1,
        name:"Darren",
        source: Images.profile1
    },
    {
        id: 2,
        name:"Lisa",
        source: Images.profile
    },
    {
        id: 3,
        name:"Sammy",
        source: Images.profile
    },
    {
        id: 4,
        name:"Paul",
        source: Images.profile
    },
    {
        id: 5,
        name:"Michale",
        source: Images.profile
    },
    {
        id: 6,
        name:"Daren",
        source: Images.profile
    },
    {
        id: 7,
        name:"Smith",
        source: Images.profile
    },
    {
        id: 8,
        name:"Hyden",
        source: Images.profile
    },
    {
        id: 9,
        name:"Simmons",
        source: Images.profile
    },
    {
        id: 10,
        name:"Wonder",
        source: Images.profile
    },
    {
        id: 11,
        name:"Darren",
        source: Images.profile1
    },
];

const PreviousListener = ({navigation}) => {
    const renderItem = ({ item }) => (
        <Listen
            name={item.name}
            source={item.source}
        />
    );
    return(
        <View>
            <Header title='Need a Listening Ear?' onPress={()=>navigation.goBack()}/>
            <FlatList
                data={DATA}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                style={{marginBottom:h('7%')}}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    
});


export default PreviousListener;
import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, AccessibilityInfo } from "react-native";

import Octicons from 'react-native-vector-icons/Octicons';

import {widthPercentageToDP as w, heightPercentageToDP as h} from 'react-native-responsive-screen';


import { Images } from "../content/Images";
import Header from "../content/contacts/Header";
import Input from "../content/contacts/Input";
import Button from "../content/contacts/Button";
import Button1 from "../content/contacts/Button1";

const PhoneNumber = ({navigation}) => {
    return(
        <View>
            <Header title='Need a Listening Ear?' onPress={()=>navigation.goBack()}/>
            <View style={styles.main}>
                <ImageBackground
                    style={styles.image}
                >
                    <Image
                        source={Images.question}
                        resizeMode='contain'
                        style={styles.image1}
                    />
                </ImageBackground>
            </View>
            <Text style={styles.text}>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</Text>
            <Button title='Send out notification' onPress={()=>navigation.navigate('Notification')}/>
            <Button1 title='Contact a previous listener' onPress={()=>navigation.navigate('PreviousListener')}/>
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        marginVertical: h('4%')
    },
    image: {
        height: h('15%'),
        width: w('30%'),
        alignSelf: 'center',
        overflow: 'hidden',
        borderRadius: 55,
        backgroundColor: '#BFBFBF'
    },
    image1: {
        alignSelf: 'center',
        height: h('15%')
    },
    view: {
        flexDirection: 'row',
        // alignItems: 'center',
        marginVertical: h('2%'),
        marginHorizontal: w('10%')
    },
    text: {
        color: '#BFBFBF',
        paddingHorizontal: '16%',
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 20
    },
});


export default PhoneNumber;
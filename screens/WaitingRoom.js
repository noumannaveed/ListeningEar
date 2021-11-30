import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, ImageBackground, Dimensions } from "react-native";

import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';
import Header from "../content/contacts/Header";

import { Images } from "../content/Images";

const { height, width } = Dimensions.get('screen');
const WaitingRoom = ({ navigation }) => {
    setTimeout(() => {
        navigation.replace("UserConnecting");
    }, 5000);
    return (
        <View style={{ flex: 1 }}>
            <Header title='Waiting Room' />
            <Text style={styles.text1}>Your notification is being sent out</Text>
            <ImageBackground style={styles.black}>
                <Image
                    style={styles.waiting}
                    source={Images.waiting}
                    resizeMode="contain"
                />
            </ImageBackground>
            <ImageBackground
                source={Images.sound_wave}
                // resizeMode="contain"
                style={styles.wave}
            >
                <Text style={styles.text}>Relax in the waiting room</Text>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    text1: {
        color: '#008AB6',
        textAlign: 'center',
        fontSize: 36,
        margin: '10%',
        fontFamily: 'Roboto-Regular',
    },
    black: {
        height: h('20%'),
        width: w('35%'),
        alignSelf: 'center',
        overflow: 'hidden',
        justifyContent: 'center',
        borderRadius: 75,
        backgroundColor: '#C4C4C4'
    },
    waiting: {
        alignSelf: 'center',
        height: h('25%'),
        width: w('20%')
    },
    text: {
        color: 'white',
        position: 'absolute',
        bottom: h('17%'),
        alignSelf: 'center',
        fontSize: 27,
        fontFamily: 'Roboto-Bold',
    },
    wave: {
        height: height * 0.4,
        width: width * 1,
        // position: 'absolute',
        // bottom: '20%',
        width: w('100%'),
    },
});

export default WaitingRoom;
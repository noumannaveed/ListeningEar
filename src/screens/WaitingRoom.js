import React from "react";
import { View, Text, Image, StyleSheet, SafeAreaView, ImageBackground, Dimensions } from "react-native";

import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';
import Header from "../components/header/Header";

import { Images } from "../assets/Images";

const { height, width } = Dimensions.get('screen');
const WaitingRoom = ({ navigation }) => {
    return (
        <SafeAreaView>
            <View>
                <Header title='Waiting Room' onPress={() => navigation.goBack()} />
                <Text style={styles.text1}>Your notification is being sent out</Text>
                <View style={styles.black}>
                    <Image
                        style={styles.waiting}
                        source={Images.waiting}
                        resizeMode="contain"
                    />
                </View>
                <ImageBackground
                    source={Images.sound_wave}
                    style={styles.wave}
                >
                    <Text style={styles.text}>Relax in the waiting room</Text>
                </ImageBackground>
            </View>
        </SafeAreaView>
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
        height: height * 0.165,
        width: height * 0.165,
        borderRadius: (height * 0.165) / 2,
        alignSelf: 'center',
        overflow: 'hidden',
        justifyContent: 'center',
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
        width: w('100%'),
    },
});

export default WaitingRoom;
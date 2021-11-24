import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, ImageBackground, Dimensions } from "react-native";

import {widthPercentageToDP as w, heightPercentageToDP as h} from 'react-native-responsive-screen';

import { Images } from "../content/Images";

// import messaging from '@react-native-firebase/messaging';


const {height, width} = Dimensions.get('screen');
const Splash = ({navigation}) => {
    setTimeout(() => {
        navigation.replace("LogIn"); 
    }, 5000);
    return(
        <View style={{flex:1}}>
            <ImageBackground style={styles.black}>
                <Image
                    style={styles.logo}
                    source={Images.logo}
                    resizeMode="contain"
                />
                <Text style={styles.text}>Parker Mason Management, LLC</Text>
            </ImageBackground>
            <ImageBackground
                source={Images.sound_wave}
                resizeMode="contain"
                style={styles.wave}
            >
            </ImageBackground>
            <View style={styles.loading}></View>
        </View>
    );
};

const styles = StyleSheet.create({
    black: {
        backgroundColor: 'black',
        height: h('70%'),
    },
    logo: {
        alignSelf: 'center',
        marginVertical: h('10%'),
        height: h('28%'),
        width: w('43%'),
    },
    text: {
        color: 'white',
        position: 'absolute',
        bottom: ('10%'),
        alignSelf: 'center',
        fontSize: 18,
    },
    wave: {
        height: height*0.4,
        width: width*1,
        // position: 'absolute',
        bottom: '20%',
    },
    loading: {
        borderBottomWidth: 7,
        borderColor: '#FFC69B',
        position: 'absolute',
        bottom: 0,
        width: w('70%')
    },
});

export default Splash;
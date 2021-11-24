import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, ImageBackground, Dimensions } from "react-native";

import {widthPercentageToDP as w, heightPercentageToDP as h} from 'react-native-responsive-screen';
import Button from "../content/contacts/Button";
import Button1 from "../content/contacts/Button1";
import Header from "../content/contacts/Header";

import { Images } from "../content/Images";

const {height, width} = Dimensions.get('screen');
const UserConnecting = ({navigation}) => {
    return(
        <View style={{flex:1}}>
            <Header title='Waiting Room' onPress={()=>navigation.goBack()}/>
            <Text style={styles.text1}>Someone would like to speak to you</Text>
            <ImageBackground style={styles.black} source={Images.wifi} resizeMode="contain">
                <Image
                    style={styles.Ellipse}
                    source={Images.Ellipse}
                    resizeMode="contain"
                />
            </ImageBackground>
            <Text style={styles.text2}>Are you available to listen and provide positive feedback?</Text>
            <ImageBackground
                source={Images.sound_wave}
                resizeMode="contain"
                style={styles.wave}
            >
                <View style={styles.buttonView}>
                    <Button title='Yes' onPress={()=>navigation.navigate('ThankYou')} style={styles.button} />
                    <Button1 title='No' style={styles.button1}/>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    text1: {
        color: '#008AB6',
        textAlign: 'center',
        fontSize: 37,
        margin: '5%',
    },
    text2: {
        color: 'black',
        textAlign: 'center',
        fontSize: 27,
        marginHorizontal: w('5%'),
    },
    black: {
        height: height*0.20,
        width: height*0.20,
        alignSelf: 'center',
        overflow: 'hidden',
    },
    Ellipse: {
        alignSelf: 'center',
        height: height*0.16,
        width: height*0.16,
    },
    wave: {
        height: height*0.4,
        width: width*1,
        // alignSelf: 'center',
        overflow: 'hidden',
        // position: 'absolute',
        // bottom: '20%',
        // width: w('100%'),
    },
    buttonView: {
        bottom: h('14%'),
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginHorizontal: w('19%'),
    },
    button: {
        paddingHorizontal:w('10%'),
    },
    button1: {
        color:'white',
        paddingHorizontal:w('10%'),
    },
});

export default UserConnecting;
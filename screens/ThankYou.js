import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, ImageBackground } from "react-native";

import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';
import Button from "../content/contacts/Button";
import Button1 from "../content/contacts/Button1";
import Header from "../content/contacts/Header";

import { Images } from "../content/Images";

const ThankYou = ({ navigation }) => {
    return (
        <View style={{ flex: 1 }}>
            <Header title='Thank You' onPress={() => navigation.goBack()} />
            <Image
                style={styles.sign}
                source={Images.sign}
                resizeMode="contain"
            />
            <Text style={styles.text}>Thanks for using Listening Ear</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        color: '#008AB6',
        textAlign: 'center',
        fontSize: 25,
        fontFamily: 'Roboto-Bold',
        marginHorizontal: w('10%')
    },
    sign: {
        alignSelf: 'center',
        height: h('40%'),
        width: w('40%')
    },
});

export default ThankYou;
import React from "react";
import { View, Text, Image, StyleSheet, SafeAreaView } from "react-native";

import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';

import Header from "../components/header/Header";

import { Images } from "../assets/Images";

const ThankYou = ({ navigation }) => {
    return (
        <SafeAreaView>
            <View style={{ flex: 1 }}>
                <Header title='Thank You' onPress={() => navigation.goBack()} />
                <Image
                    style={styles.sign}
                    source={Images.sign}
                    resizeMode="contain"
                />
                <Text style={styles.text}>Thanks for using Listening Ear</Text>
            </View>
        </SafeAreaView>
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
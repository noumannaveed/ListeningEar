import React from "react";
import { View, Text, Image, StyleSheet,Dimensions, SafeAreaView } from "react-native";


import Header from "../components/header/Header";

import { Images } from "../assets/Images";
const { height, width } = Dimensions.get('screen');
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
        marginHorizontal: width * 0.1,
    },
    sign: {
        alignSelf: 'center',
        height: height * 0.4,
        width: width * 0.4,
    },
});

export default ThankYou;
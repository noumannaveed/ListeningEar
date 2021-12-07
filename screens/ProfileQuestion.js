import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, SafeAreaView } from "react-native";

import Octicons from 'react-native-vector-icons/Octicons';

import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';


import { Images } from "../content/Images";
import Header from "../content/contacts/Header";
import Input from "../content/contacts/Input";
import Button from "../content/contacts/Button";

const ProfileQuestion = ({ navigation }) => {
    return (
        <SafeAreaView>
            <View>
                <Header title='Profile Question' onPress={() => navigation.goBack()} />
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
                <View style={styles.view}>
                    <Octicons name="primitive-dot" size={20} color="#BFBFBF" />
                    <Text style={styles.text}>Anyone can create a profile free of charge</Text>
                </View>
                <View style={styles.view}>
                    <Octicons name="primitive-dot" size={20} color="#BFBFBF" />
                    <Text style={styles.text}>They can recieve notifications (Ability to turn on and off notifications)</Text>
                </View>
            </View>
        </SafeAreaView>
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
        marginHorizontal: w('10%'),
    },
    text: {
        color: '#8B8B8B',
        paddingHorizontal: '10%',
        fontSize: 18,
        fontFamily: 'Roboto-Regular',
    },
});


export default ProfileQuestion;
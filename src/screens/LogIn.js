import React from "react";
import { View, Text, StyleSheet, Image, SafeAreaView } from "react-native";

import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';
import Button from "../components/buttons/Button";
import Button1 from "../components/buttons/Button1";



import { Images } from "../assets/Images";

const LogIn = ({ navigation }) => {
    return (
        <SafeAreaView>
            <View>
                <Image
                    source={Images.logo1}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.text}>Your Place For The Unbias Opinion</Text>
                <Text style={styles.text1}>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</Text>
                <Button title='Login' onPress={() => navigation.replace('SignIn')} />
                <Button1 title='Create Profile' onPress={() => navigation.navigate('SignUp')} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    logo: {
        alignSelf: 'center',
        marginVertical: h('10%'),
        height: h('20%'),
        width: w('40%'),
    },
    text: {
        textAlign: 'center',
        fontFamily: 'Roboto-Bold',
        fontSize: 15,
        color: 'black',
    },
    text1: {
        textAlign: 'center',
        paddingHorizontal: w('16%'),
        paddingVertical: h('3%'),
        fontSize: 15,
        fontFamily: 'Roboto-Regular',
        color: '#8B8B8B',
    },
    text2: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 15,
        color: 'black'
    },
    button1: {
        alignItems: "center",
        borderColor: "#FFC69B",
        borderWidth: 1,
        padding: '3%',
        marginHorizontal: w('17%'),
        marginVertical: h('1%'),
        borderRadius: 50
    },
});


export default LogIn;
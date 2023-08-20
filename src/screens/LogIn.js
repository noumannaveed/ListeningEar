import React from "react";
import { View, Text, StyleSheet, Image,Dimensions, SafeAreaView } from "react-native";

import Button from "../components/buttons/Button";
import Button1 from "../components/buttons/Button1";

import { Images } from "../assets/Images";
const { height, width } = Dimensions.get('screen');
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
                <Button title='Login' onPress={() => navigation.replace('SignIn')} />
                <Button1 title='Create Profile' onPress={() => navigation.navigate('SignUp')} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    logo: {
        alignSelf: 'center',
        marginVertical: height * 0.05,
        height: height * 0.4,
        width: width * 0.7,
    },
    text: {
        textAlign: 'center',
        fontFamily: 'Roboto-Bold',
        fontSize: 15,
        color: 'black',
    },
});


export default LogIn;
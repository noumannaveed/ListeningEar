import React from "react";
import { View, Text, StyleSheet, Image, Dimensions, SafeAreaView } from "react-native";

import { Images } from "../assets/Images";
import Header from "../components/header/Header";
import Button from "../components/buttons/Button";
import Button1 from "../components/buttons/Button1";

const { height, width } = Dimensions.get('screen');

const PhoneNumber = ({ navigation }) => {
    
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <Header title='Need a Listening Ear?' icon1={'profile'} onPressProfile={()=>navigation.navigate('EditProfile')} />
                <View style={styles.main}>
                    <Image
                        source={Images.question}
                        resizeMode='contain'
                        style={styles.image1}
                    />
                </View>
                <Text style={styles.text}>Here you can find your Listening ear.</Text>
                <Button title='Send out notification' onPress={() => navigation.navigate('Notification')} />
                <Button1 title='Contact a previous listener' onPress={() => navigation.navigate('PreviousListener')} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    main: {
        marginVertical: height * 0.04,
        height: height * 0.14,
        width: height * 0.14,
        borderRadius: (height * 0.14) / 2,
        alignSelf: 'center',
        overflow: 'hidden',
        backgroundColor: '#BFBFBF',
    },
    image1: {
        alignSelf: 'center',
        height: height * 0.14,
        overflow: 'hidden',
    },
    text: {
        color: '#BFBFBF',
        paddingHorizontal: width * 0.16,
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
        textAlign: 'center',
        marginVertical: height * 0.02,
    },
});

export default PhoneNumber;
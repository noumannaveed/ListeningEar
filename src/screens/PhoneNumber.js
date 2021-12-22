import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Dimensions, SafeAreaView } from "react-native";

import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';

import { ActivityIndicator } from "react-native-paper";

import { signout } from "../auth/FireBase";
import { Images } from "../assets/Images";
import Header from "../components/header/Header";
import Button from "../components/buttons/Button";
import Button1 from "../components/buttons/Button1";

const { height, width } = Dimensions.get('screen');

const PhoneNumber = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(false);

    const logOut = async () => {
        setIsLoading(true);
        signout()
            .then((user) => {
                console.log(user);
                navigation.navigate('SignIn');
                setIsLoading(false);
            })
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <Header title='Need a Listening Ear?' />
                <View style={styles.main}>
                    <View
                        style={styles.image}
                    >
                        <Image
                            source={Images.question}
                            resizeMode='contain'
                            style={styles.image1}
                        />
                    </View>
                </View>
                <Text style={styles.text}>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</Text>
                <Button title='Send out notification' onPress={() => navigation.navigate('Notification')} />
                <Button1 title='Contact a previous listener' onPress={() => navigation.navigate('PreviousListener')} />
                <View>
                    {isLoading ? (
                        <ActivityIndicator color='#FFC69B' animating={isLoading} />
                    ) : (
                        <Button title='Log Out' onPress={logOut} />
                    )
                    }
                </View>
                <Button title='Edit Profile' onPress={() => navigation.navigate('EditProfile')} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    main: {
        marginVertical: h('4%')
    },
    image: {
        height: height * 0.14,
        width: height * 0.14,
        borderRadius: (height * 0.14) / 2,
        alignSelf: 'center',
        overflow: 'hidden',
        borderRadius: 50,
        backgroundColor: '#BFBFBF'
    },
    image1: {
        alignSelf: 'center',
        height: h('15%'),
        overflow: 'hidden',
    },
    view: {
        flexDirection: 'row',
        // alignItems: 'center',
        marginVertical: h('2%'),
        marginHorizontal: w('10%')
    },
    text: {
        color: '#BFBFBF',
        paddingHorizontal: w('16%'),
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
        textAlign: 'center',
        marginVertical: h('2%')
    },
});


export default PhoneNumber;
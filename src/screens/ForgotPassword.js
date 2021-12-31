import React, { useState } from "react";

import { View, Text, Alert } from "react-native";

import Button from "../components/buttons/Button";
import Input from "../components/input/Input";
import Header from "../components/header/Header";


import auth from '@react-native-firebase/auth';

import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';



const ForgotPassword = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const validate_field = () => {
        if (email == '') {
            alert("Please enter email");
            return false;
        }
        return true;
    }
    const reset = async () => {
        console.log('email=',email);
        if (validate_field()) {
            try {
                await auth().sendPasswordResetEmail(email);
                navigation.navigate('SignIn')
            } catch (e) {
                Alert.alert(
                    e.message
                );
            }
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <Header title='Forgot Password' onPress={() => navigation.goBack()} />
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <View style={{ height: h('10%') }}>
                    <Input placeholder='E-mail Address' value={email} onChangeText={(email) => setEmail(email)} />
                </View>
                <Button title='Reset Password' onPress={() => reset()} />
            </View>
        </View>
    );
};

export default ForgotPassword;
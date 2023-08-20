import React, { useState } from "react";

import { View, Dimensions, Alert } from "react-native";

import Button from "../components/buttons/Button";
import Input from "../components/input/Input";
import EditHeader from "../components/header/EditHeader";

import auth from '@react-native-firebase/auth';

const { height, width } = Dimensions.get('screen');
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
            <EditHeader backIcon='chevron-back' backText='Back' title='Forgot Password' onPress={() => navigation.goBack()} />
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <View style={{ height: height * 0.1 }}>
                    <Input placeholder='E-mail Address' value={email} onChangeText={(email) => setEmail(email)} />
                </View>
                <Button title='Reset Password' onPress={() => reset()} />
            </View>
        </View>
    );
};

export default ForgotPassword;
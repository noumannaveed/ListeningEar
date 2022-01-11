import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Dimensions, ScrollView, Alert, Platform } from "react-native";

import NetInfo from "@react-native-community/netinfo";

import Ionicons from 'react-native-vector-icons/Ionicons';

import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';

import firestore from '@react-native-firebase/firestore';

import { Images } from "../assets/Images";
import Input from "../components/input/Input";
import Button from "../components/buttons/Button";
import Button1 from "../components/buttons/Button1";

import { ActivityIndicator } from "react-native-paper";
import { login } from "../auth/FireBase";

import NoConnectionScreen from "./NoConnectionScreen";

const { height, width } = Dimensions.get('screen');
const SignIn = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSecureEntry, setIsSecureEntry] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [connectStatus, setConnectStatus] = useState('');
    // var connectStatus = '';
    const validate_field = () => {
        if (email == '') {
            alert("Please enter email");
            return false;
        } else if (password == '') {
            alert("Please enter password");
            return false;
        }
        return true;
    }

    const CheckConnectivity = () => {
        NetInfo.addEventListener(state => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
            // if (state.isConnected === true) {
            //     Alert.alert('online')
            // } else if (state.isConnected === false) {
            //     Alert.alert('offline')
            // }
            setConnectStatus(state.isConnected);
        });
    };

    useEffect(() => {
        CheckConnectivity();
        // // var json = JSON.parse(CheckConnectivity())
        // // setConnectStatus(CheckConnectivity())
        // connectStatus = CheckConnectivity()
        // console.log('Check=', connectStatus);
    }, [])

    const logIn = async () => {
        if (validate_field()) {
            login(email, password, setIsLoading)
                .then(async (user) => {
                    const user1 = await firestore().collection('Users').doc(user.user.user.uid).get();
                    console.log('user=', user1);
                    navigation.replace('PhoneNumber');
                })
                .catch((error) => {
                    console.log(error);
                    alert(error.error);
                })
        }
    }
    return (
        connectStatus ?
            (<SafeAreaView>
                <View>
                    <ScrollView>
                        <Image
                            source={Images.logo1}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Input placeholder='E-mail Address' value={email} onChangeText={(email) => setEmail(email)} />
                        <Input
                            placeholder='Password'
                            value={password}
                            onChangeText={(password) => setPassword(password)}
                            icon={
                                <TouchableOpacity onPress={() => {
                                    setIsSecureEntry((prev) => !prev)
                                }}>
                                    <Ionicons name={isSecureEntry ? "eye-outline" : "eye-off-outline"} size={20} />
                                </TouchableOpacity>
                            }
                            secureTextEntry={isSecureEntry}
                        />
                        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                            <Text style={styles.text1}>Forgot Password</Text>
                        </TouchableOpacity>
                        <View>
                            {isLoading ? (
                                <ActivityIndicator color='#FFC69B' animating={setIsLoading} />
                            ) : (
                                <Button title='Log In' onPress={logIn} />
                            )
                            }
                        </View>
                        <Text style={styles.text}>OR</Text>
                        <Button1 title='Create Profile' onPress={() => navigation.navigate('SignUp')} />
                    </ScrollView>
                </View>
            </SafeAreaView>) : (<NoConnectionScreen />)
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
        fontWeight: 'bold',
        color: 'black',
        marginVertical: h('1%'),
        fontSize: 18
    },
    text1: {
        // textAlign: 'center',
        fontFamily: 'Roboto-Bold',
        color: '#008AB6',
        marginVertical: h('2%'),
        marginHorizontal: w('10%'),
        fontSize: 15
    },
});


export default SignIn;
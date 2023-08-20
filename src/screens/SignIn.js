import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Dimensions, ScrollView } from "react-native";

import NetInfo from "@react-native-community/netinfo";

import Ionicons from 'react-native-vector-icons/Ionicons';

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
            setConnectStatus(state.isConnected);
        });
    };

    useEffect(() => {
        CheckConnectivity();
    }, [])

    const logIn = () => {
        if (validate_field()) {
            login(email, password, setIsLoading)
                .then((user) => {
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
                <View style={{justifyContent: 'center'}}>
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
                            <Text style={styles.text1}>Forgot Password?</Text>
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
        // marginVertical: h('5%'),
        height: height * 0.35,
        width: width * 0.7,
    },
    text: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'black',
        marginVertical: height * 0.01,
        fontSize: 18,
    },
    text1: {
        fontFamily: 'Roboto-Bold',
        color: '#008AB6',
        marginVertical: height * 0.02,
        marginHorizontal: width * 0.1,
        fontSize: 15,
    },
});

export default SignIn;
import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Dimensions, ScrollView, KeyboardAvoidingView, Platform } from "react-native";

import Ionicons from 'react-native-vector-icons/Ionicons';

import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';
import DropDownPicker from "react-native-custom-dropdown";

import { Images } from "../assets/Images";
import Header from "../components/header/Header";
import Input from "../components/input/Input";
import Button from "../components/buttons/Button";
import { signup } from "../auth/FireBase";


const { height, width } = Dimensions.get('screen');
const SignUp = ({ navigation }) => {
    const [image, setImage] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSecureEntry, setIsSecureEntry] = useState(true);
    const [check, setCheck] = useState(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Entertainment', value: 'entertainment' },
        { label: 'Sports', value: 'sports' },
        { label: 'Travelling', value: 'travelling' },
        { label: 'Eating', value: 'eating' },
    ]);
    const [interest, setInterest] = useState('');
    // const reference = storage().ref('Images.profile');
    const goToPickImage = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
        }).then((res) => {
            setImage(res.path);
            setCheck(true);
            // console.log(res.path);
        });
    };
    const validate_field = () => {
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (firstName == '') {
            alert("Please Enter first name");
            return false;
        } else if (lastName == '') {
            alert("Please Enter last name");
            return false;
        } else if (email == '') {
            alert("Please Enter email");
            return false;
        } else if (reg.test(email) == false) {
            alert("Incorrect Email");
            return false;
        } else if (password == '') {
            alert("Please Enter password");
            return false;
        } else if (password.length < 6) {
            alert("Password will be minimum 6 characters");
            return false;
        }
        return true;
    }
    const signUp = async () => {
        if (validate_field()) {
            signup(email, password, firstName, lastName, image, interest, check)
                .then((user) => {
                    console.log('user=', user);
                    navigation.replace('SignIn');
                })
                .catch((error) => {
                    console.log(error);
                    alert(error.error);
                })
        }
    }
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                    <Header title='Create Profile' onPress={() => navigation.goBack()} />
                    <ScrollView style={styles.container}>
                        <TouchableOpacity style={styles.main} onPress={() => goToPickImage()}>
                            <View
                                resizeMode='contain'
                                style={styles.image}
                            >
                                <Image
                                    source={image ? { uri: image } : Images.profile}
                                    style={styles.image}
                                />
                            </View>
                            <TouchableOpacity style={styles.camera}>
                                <Ionicons name="md-camera" size={22} color="#dbd5d5" style={{ top: h('0.3%') }} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                        <Input placeholder='First Name' value={firstName} onChangeText={(firstName) => setFirstName(firstName)} />
                        <Input placeholder='Last Name' value={lastName} onChangeText={(lastName) => setLastName(lastName)} />
                        <View style={styles.pick}>
                            <DropDownPicker
                                placeholder='Select one option here....'
                                placeholderStyle={{ color: '#8B8B8B' }}
                                open={open}
                                value={value}
                                items={items}
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setItems}
                                style={styles.picker}
                                containerStyle={{ height: h('7%') }}
                                arrowColor='#8B8B8B'
                                onChangeItem={(interest) => setInterest(interest)}
                                itemStyle={{
                                    justifyContent: 'flex-start',
                                }}
                                dropDownStyle={{
                                    borderTopLeftRadius: 20, borderTopRightRadius: 20,
                                    borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
                                    backgroundColor: '#f5f5f5',
                                }}
                            />
                        </View>
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
                        <Button title='Create Your Profile' onPress={signUp} />
                        <Text style={styles.text}>OR</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('ProfileQuestion')}>
                            <Text style={styles.text1}>Create Profile with phone number</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    main: {
        marginVertical: h('4%'),
        height: height * 0.15,
        width: height * 0.15,
        borderRadius: (height * 0.15) / 2,
        alignSelf: 'center',
    },
    image: {
        height: height * 0.15,
        width: height * 0.15,
        alignSelf: 'center',
        overflow: 'hidden',
        borderRadius: (height * 0.15) / 2,
        borderWidth: 1,
    },
    camera: {
        alignItems: 'center',
        // justifyContent: 'center',
        // marginHorizontal: width * 0.46,
        height: width * 0.08,
        width: width * 0.08,
        backgroundColor: '#C4C4C4',
        borderRadius: (width * 0.08) / 2,
        bottom: h('5%'),
        left: h('11%'),
        opacity: 0.9,
    },
    text: {
        textAlign: 'center',
        fontFamily: 'Roboto-Bold',
        color: 'black',
        marginVertical: h('1%'),
        fontSize: 18
    },
    text1: {
        textAlign: 'center',
        fontFamily: 'Roboto-Bold',
        color: '#008AB6',
        marginVertical: h('1%'),
        fontSize: 18
    },
    pick: {
        marginHorizontal: w('10%'),
        marginVertical: h('1%'),
    },
    picker: {
        paddingHorizontal: w('3%'),
        borderTopLeftRadius: 50, borderTopRightRadius: 50,
        borderBottomLeftRadius: 50, borderBottomRightRadius: 50,
        backgroundColor: '#f5f5f5',
        borderColor: '#8B8B8B',
    },
});


export default SignUp;
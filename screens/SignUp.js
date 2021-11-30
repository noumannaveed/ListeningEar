import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, Dimensions, ScrollView } from "react-native";

import Ionicons from 'react-native-vector-icons/Ionicons';

import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';
import DropDownPicker from "react-native-custom-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import storage from '@react-native-firebase/storage';

import { Images } from "../content/Images";
import Header from "../content/contacts/Header";
import Input from "../content/contacts/Input";
import Button from "../content/contacts/Button";
import { signup } from "../auth/FireBase";


const { height, width } = Dimensions.get('screen');
const SignUp = ({ navigation }) => {
    const [image, setImage] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSecureEntry, setIsSecureEntry] = useState(true);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' }
    ])
    // const reference = storage().ref('Images.profile');
    const goToPickImage = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
        }).then((res) => {
            setImage(res.path);
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
            signup(email, password, firstName, lastName, image)
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
        <View>
            <Header title='Create Profile' onPress={() => navigation.goBack()} />
            <ScrollView>
                <View style={styles.main}>
                    <View
                        resizeMode='contain'
                        style={styles.image}
                    >
                        <Image
                            source={image ? { uri: image } : Images.profile}
                            style={styles.image}
                        />
                    </View>
                    <TouchableOpacity style={styles.camera} onPress={() => goToPickImage()}>
                        <Ionicons name="md-camera" size={22} color="#dbd5d5" />
                    </TouchableOpacity>
                </View>
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
                        style={{
                            borderTopLeftRadius: 50, borderTopRightRadius: 50,
                            borderBottomLeftRadius: 50, borderBottomRightRadius: 50,
                            backgroundColor:'white',
                            borderColor:'#8B8B8B'
                        }}
                        itemStyle={{
                            // justifyContent: 'space-between',
                            flex: 1
                        }}
                    />
                    {console.log(value)}
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
    );
};

const styles = StyleSheet.create({
    main: {
        marginVertical: h('4%')
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
        // marginHorizontal: w('46%'),
        marginHorizontal: width * 0.46,
        height: width * 0.08,
        width: width * 0.08,
        backgroundColor: '#C4C4C4',
        borderRadius: (width * 0.08) / 2,
        bottom: h('5%'),
        left: w('12%'),
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
        borderRadius: 50,
        borderColor: '#C4C4C4'
    },
});


export default SignUp;
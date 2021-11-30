import React, { useState, useEffect, Component } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, Dimensions, ScrollView, Alert } from "react-native";

import Ionicons from 'react-native-vector-icons/Ionicons';

import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';
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
export default class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: '',
            firstName: '',
            lastName: '',
            check: false,
            url: '',
            userData: '',
        };
    }
    goToPickImage = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
        }).then((res) => {
            this.setState({
                check: true,
                image: res.path,
            });
        });
    };
    validate_field = () => {
        if (firstName == '') {
            alert("Please Enter first name");
            return false;
        } else if (lastName == '') {
            alert("Please Enter last name");
            return false;
        }
        return true;
    }
    getUser = async () => {
        let value = await AsyncStorage.getItem('uid');
        let parse = JSON.parse(value);
        firestore()
            .collection('Users')
            .doc(parse.user.uid)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    console.log('pvalue=', doc);
                    const data = doc.data();
                    console.log('data=', data.image);
                    this.setState({
                        image: data.image,
                        firstName: data.firstname,
                        lastName: data.lastname,
                    });
                    console.log('image=', data.image);
                }
            });
    }
    async componentDidMount() {
        await this.getUser();
    }
    update = async () => {
        console.log('check=', this.state.check);

        if (this.state.check) {
            try {
                const uploadUri = this.state.image;
                let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
                await storage().ref(filename).putFile(uploadUri);
                this.setState({
                    url: await storage().ref(filename).getDownloadURL(),
                });
                console.log('upload=', uploadUri);
            } catch (error) {
                console.log('error=', error);
            }
        }
        let value = await AsyncStorage.getItem('uid');
        let parse = JSON.parse(value);
        console.log('value=', parse.user.uid);
        firestore()
            .collection('Users')
            .doc(parse.user.uid)
            .update({
                image: this.state.url,
                firstname: this.state.firstName,
                lastname: this.state.lastName,
            })
            .then(() => {
                Alert.alert('Successfully Updated!')
                console.log('User updated!');
            });
    }
    render() {
        return (
            <View>
                <Header title='Create Profile' onPress={() => this.props.navigation.goBack()} />
                <ScrollView>
                    <View style={styles.main}>
                        <View
                            resizeMode='contain'
                            style={styles.image}
                        >
                            <Image
                                source={{ uri: this.state.image }}
                                style={{ height: 200, width: 200 }}
                            />
                        </View>
                        <TouchableOpacity style={styles.camera} onPress={this.goToPickImage}>
                            <Ionicons name="md-camera" size={22} color="#dbd5d5" />
                        </TouchableOpacity>
                    </View>
                    <Input placeholder='First Name' value={this.state.firstName} onChangeText={(firstName) => this.setState({ firstName })} />
                    <Input placeholder='Last Name' value={this.state.lastName} onChangeText={(lastName) => this.setState(lastName)} />
                    <Button title='Update Your Profile' onPress={this.update} />
                </ScrollView>
            </View>
        );
    }
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
});

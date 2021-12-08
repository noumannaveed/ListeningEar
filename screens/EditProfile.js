import React, { useState, useEffect, Component } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Dimensions, ScrollView, Alert } from "react-native";

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


import { ActivityIndicator } from "react-native-paper";

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
            loading: false,
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
        this.setState({ loading: true });
        let value = await AsyncStorage.getItem('uid');
        let parse = JSON.parse(value);
        firestore()
            .collection('Users')
            .doc(parse.user.uid)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    // console.log('pvalue=', doc);
                    const data = doc.data();
                    // console.log('data=', data.image);
                    this.setState({
                        image: data.image,
                        firstName: data.firstname,
                        lastName: data.lastname,
                    });
                    // console.log('image=', data.image);
                }
            });
        this.setState({ loading: false });
    }
    async componentDidMount() {
        await this.getUser();
    }
    update = async () => {
        // console.log('check=', this.state.check);
        this.setState({ loading: true });
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
        // console.log('value=', parse.user.uid);
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
                this.setState({ loading: false });
            });
    }
    render() {
        return (
            <SafeAreaView>
                <View>
                    <Header title='Create Profile' onPress={() => this.props.navigation.goBack()} />
                    <ScrollView>
                        <TouchableOpacity style={styles.main} onPress={this.goToPickImage}>
                            <View
                                resizeMode='contain'
                                style={styles.image}
                            >
                                <Image
                                    source={{ uri: this.state.image }}
                                    style={styles.image}
                                />
                            </View>
                            <TouchableOpacity style={styles.camera}>
                                <Ionicons name="md-camera" size={22} color="#dbd5d5" style={{ top: h('0.3%') }} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                        <Input placeholder='First Name' value={this.state.firstName} onChangeText={(firstName) => this.setState({ firstName })} />
                        <Input placeholder='Last Name' value={this.state.lastName} onChangeText={(lastName) => this.setState({ lastName })} />
                        <View>
                            {this.state.loading ? (
                                <ActivityIndicator color='#FFC69B' animating={this.state.loading} />
                            ) : (
                                <Button title='Update Your Profile' onPress={this.update} />
                            )
                            }
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
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
        marginHorizontal: width * 0.46,
        height: width * 0.08,
        width: width * 0.08,
        backgroundColor: '#C4C4C4',
        borderRadius: (width * 0.08) / 2,
        bottom: h('5%'),
        left: h('6%'),
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

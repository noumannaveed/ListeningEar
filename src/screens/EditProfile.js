import React, { Component } from "react";
import { View, StyleSheet, Image, TouchableOpacity, SafeAreaView, Dimensions, ScrollView, Alert } from "react-native";

import Ionicons from 'react-native-vector-icons/Ionicons';

import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';
import DropDownPicker from "react-native-custom-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import Header from "../components/header/Header";
import Input from "../components/input/Input";
import Button from "../components/buttons/Button";


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
            open: false,
            value: null,
            items: [{ label: 'Entertainment', value: 'entertainment' },
            { label: 'Sports', value: 'sports' },
            { label: 'Travelling', value: 'travelling' },
            { label: 'Eating', value: 'eating' },],
            interest: '',
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
        let value = await AsyncStorage.getItem('uid');
        let parse = JSON.parse(value);
        // console.log('check=', this.state.check);
        this.setState({ loading: true });
        if (this.state.check) {
            var desertRef = storage.child(this.state.image);

            // Delete the file
            desertRef.delete().then(function () {
                // File deleted successfully
            }).catch(function (error) {
                // Uh-oh, an error occurred!
            });
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
        } else if (this.state.check === false) {
            this.setState({ url: this.state.image })
        }
        // console.log('value=', parse.user.uid);
        firestore()
            .collection('Users')
            .doc(parse.user.uid)
            .update({
                image: this.state.url,
                firstname: this.state.firstName,
                lastname: this.state.lastName,
                interest: this.state.interest,
            })
            .then(() => {
                Alert.alert('Successfully Updated!')
                console.log('User updated!');
                this.setState({ loading: false });
            });
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <Header title='Create Profile' onPress={() => this.props.navigation.goBack()} />
                    <ScrollView style={{ flex: 1 }}>
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
                            <TouchableOpacity style={styles.camera} onPress={this.goToPickImage}>
                                <Ionicons name="md-camera" size={22} color="#dbd5d5" style={{ top: h('0.3%') }} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                        <Input placeholder='First Name' value={this.state.firstName} onChangeText={(firstName) => this.setState({ firstName })} />
                        <Input placeholder='Last Name' value={this.state.lastName} onChangeText={(lastName) => this.setState({ lastName })} />
                        <View style={styles.pick}>
                            <DropDownPicker
                                placeholder='Select one option here....'
                                placeholderStyle={{ color: '#8B8B8B' }}
                                open={this.state.open}
                                value={this.state.value}
                                items={this.state.items}
                                setOpen={(open) => this.setState({ open })}
                                setValue={(value) => this.setState({ value })}
                                setItems={(items) => this.setState({ items })}
                                style={styles.picker}
                                containerStyle={{ height: h('7%') }}
                                arrowColor='#8B8B8B'
                                onChangeItem={(interest) => this.setState({ interest })}
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
        marginVertical: h('4%'),
        // borderWidth: 1,
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
        height: h('20%')
    },
    picker: {
        borderTopLeftRadius: 50, borderTopRightRadius: 50,
        borderBottomLeftRadius: 50, borderBottomRightRadius: 50,
        borderColor: '#8B8B8B',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: w('3%'),
    },
});

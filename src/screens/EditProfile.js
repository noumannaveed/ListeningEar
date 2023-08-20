import React, { Component } from "react";
import { View, StyleSheet, Image, TouchableOpacity, SafeAreaView, Dimensions, ScrollView, Text } from "react-native";

import Ionicons from 'react-native-vector-icons/Ionicons';
import { signout } from "../auth/FireBase";

import ImagePicker from 'react-native-image-crop-picker';
import DropDownPicker from "react-native-custom-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import EditHeader from "../components/header/EditHeader";
import Input from "../components/input/Input";
import Button from "../components/buttons/Button";

import { Switch } from 'react-native-paper';

import { ActivityIndicator } from "react-native-paper";

const { height, width } = Dimensions.get('screen');
export default class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: '',
            firstName: '',
            lastName: '',
            email: '',
            check: false,
            url: '',
            userData: '',
            loading: false,
            open: false,
            value: null,
            genders: [
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
                { label: 'Gay-Male', value: 'gay-Male' },
                { label: 'Gay-Female', value: 'gay-Female' },
                { label: 'Male identify as Female', value: 'male identify as Female' },
                { label: 'Female identify as Male', value: 'female identify as Male' },
            ],
            races: [
                { label: 'Black', value: 'black' },
                { label: 'White', value: 'white' },
                { label: 'Asian', value: 'asian' },
                { label: 'Pacific Islander', value: 'pacific Islander' },
                { label: 'Hispanic Black', value: 'hispanic Black' },
                { label: 'Hispanic White', value: 'hispanic White' },
                { label: 'Indian', value: 'indian' },
                { label: 'Other', value: 'other' },
            ],
            ages: [
                { label: '13-18', value: '13-18' },
                { label: '18-25', value: '18-25' },
                { label: '25-35', value: '25-35' },
                { label: '35-50', value: '35-50' },
                { label: '50+', value: '50+' },
            ],
            gender: '',
            race: '',
            age: '',
            prevImage: '',
            isSwitchOn: '',
            isLoading: false,
        };
    }
    onToggleSwitch = () => this.setState({ isSwitchOn: !isSwitchOn });
    goToPickImage = () => {
        this.setState({ prevImage: this.state.image })
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
                    const data = doc.data();
                    console.log(data.interest)
                    this.setState({
                        image: data.image,
                        firstName: data.firstname,
                        lastName: data.lastname,
                        email: data.email,
                        gender: { label: data.gender.label, value: data.gender.value },
                        race: { label: data.race.label, value: data.race.value },
                        age: { label: data.age.label, value: data.age.value },
                        isSwitchOn: data.enable,
                    });
                }
            });
        this.setState({ loading: false });
    }
    componentDidMount() {
        this.getUser();
    }
    update = async () => {
        let value = await AsyncStorage.getItem('uid');
        let parse = JSON.parse(value);
        this.setState({ loading: true });
        if (this.state.check) {
            try {
                if (this.state.prevImage != '') {
                    let imageRef = storage().refFromURL(this.state.prevImage);
                    imageRef.delete()
                }
                const uploadUri = this.state.image;
                let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
                await storage().ref(filename).putFile(uploadUri);
                this.setState({
                    url: await storage().ref(filename).getDownloadURL(),
                });
            } catch (error) {
                console.log('error=', error);
            }
        } else if (this.state.check === false) {
            this.setState({ url: this.state.image })
        }
        firestore()
            .collection('Users')
            .doc(parse.user.uid)
            .update({
                image: this.state.url,
                firstname: this.state.firstName,
                lastname: this.state.lastName,
                gender: this.state.gender,
                race: this.state.race,
                age: this.state.age,
                enable: this.state.isSwitchOn,
            })
            .then(() => {
                alert('Successfully Updated!')
                console.log('User updated!');
                this.setState({ loading: false });
            });
    }

    logOut = () => {
        this.setState({ isLoading: true });
        signout()
            .then((user) => {
                console.log(user);
                this.props.navigation.replace('SignIn');
                this.setState({ isLoading: false });
            })
    }

    render() {
        const { isSwitchOn } = this.state;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <EditHeader backIcon='chevron-back' backText='Back' title='Create Profile' onPress={() => this.props.navigation.goBack()} />
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
                                <Ionicons name="md-camera" size={22} color="#dbd5d5" style={{ top: height * 0.0021 }} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                        <Input placeholder='Email' value={this.state.email} />
                        <Input placeholder='First Name' value={this.state.firstName} onChangeText={(firstName) => this.setState({ firstName })} />
                        <Input placeholder='Last Name' value={this.state.lastName} onChangeText={(lastName) => this.setState({ lastName })} />
                        <View style={styles.pick}>
                            <DropDownPicker
                                placeholder='Gender....'
                                placeholderStyle={{ color: '#8B8B8B' }}
                                open={this.state.open}
                                value={this.state.value}
                                defaultValue={this.state.gender}
                                items={this.state.genders}
                                setOpen={(open) => this.setState({ open })}
                                setValue={(value) => this.setState({ value })}
                                setItems={(genders) => this.setState({ genders })}
                                style={styles.picker}
                                containerStyle={{ height: height * 0.07 }}
                                arrowColor='#8B8B8B'
                                onChangeItem={(gender) => this.setState({ gender })}
                                itemStyle={{
                                    justifyContent: 'flex-start',
                                }}
                                dropDownStyle={{
                                    borderTopLeftRadius: 20, borderTopRightRadius: 20,
                                    borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
                                    backgroundColor: '#f5f5f5',
                                }}
                                activeLabelStyle={{ color: 'grey' }}
                                labelStyle={{
                                    color: 'black'
                                }}
                            />
                        </View>
                        <View style={styles.pick}>
                            <DropDownPicker
                                placeholder='Race....'
                                placeholderStyle={{ color: '#8B8B8B' }}
                                open={this.state.open}
                                value={this.state.value}
                                defaultValue={this.state.race}
                                items={this.state.races}
                                setOpen={(open) => this.setState({ open })}
                                setValue={(value) => this.setState({ value })}
                                setItems={(races) => this.setState({ races })}
                                style={styles.picker}
                                containerStyle={{ height: height * 0.07 }}
                                arrowColor='#8B8B8B'
                                onChangeItem={(race) => this.setState({ race })}
                                itemStyle={{
                                    justifyContent: 'flex-start',
                                }}
                                dropDownStyle={{
                                    borderTopLeftRadius: 20, borderTopRightRadius: 20,
                                    borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
                                    backgroundColor: '#f5f5f5',
                                }}
                                activeLabelStyle={{ color: 'grey' }}
                                labelStyle={{
                                    color: 'black'
                                }}
                            />
                        </View>
                        <View style={styles.pick}>
                            <DropDownPicker
                                placeholder='Age....'
                                placeholderStyle={{ color: '#8B8B8B' }}
                                open={this.state.open}
                                value={this.state.value}
                                defaultValue={this.state.age}
                                items={this.state.ages}
                                setOpen={(open) => this.setState({ open })}
                                setValue={(value) => this.setState({ value })}
                                setItems={(ages) => this.setState({ ages })}
                                style={styles.picker}
                                containerStyle={{ height: height * 0.07 }}
                                arrowColor='#8B8B8B'
                                onChangeItem={(age) => this.setState({ age })}
                                itemStyle={{
                                    justifyContent: 'flex-start',
                                }}
                                dropDownStyle={{
                                    borderTopLeftRadius: 20, borderTopRightRadius: 20,
                                    borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
                                    backgroundColor: '#f5f5f5',
                                }}
                                activeLabelStyle={{ color: 'grey' }}
                                labelStyle={{
                                    color: 'black'
                                }}
                            />
                        </View>
                        <Switch
                            value={this.state.isSwitchOn}
                            onValueChange={() => { this.setState({ isSwitchOn: !isSwitchOn }); }}
                            color='#FFC69B'
                            style={styles.switch}
                        />
                        <Text style={styles.text1}>Enable for Notification</Text>
                        <View>
                            {this.state.loading ? (
                                <ActivityIndicator color='#FFC69B' animating={this.state.loading} />
                            ) : (
                                <Button title='Update Your Profile' onPress={this.update} />
                            )
                            }
                        </View>
                        <View>
                            {this.state.isLoading ? (
                                <ActivityIndicator color='#FFC69B' animating={this.state.isLoading} />
                            ) : (
                                <Button title='Log Out' onPress={this.logOut} />
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
        marginVertical: height * 0.01,
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
        borderWidth: width * 0.0025,
        backgroundColor: 'black',
    },
    camera: {
        alignItems: 'center',
        height: height * 0.04,
        width: height * 0.04,
        backgroundColor: '#C4C4C4',
        borderRadius: (height * 0.04) / 2,
        bottom: height * 0.05,
        left: width * 0.22,
        opacity: 0.9,
    },
    text: {
        textAlign: 'center',
        fontFamily: 'Roboto-Bold',
        color: 'black',
        marginVertical: height * 0.01,
        fontSize: 18
    },
    text1: {
        textAlign: 'center',
        fontFamily: 'Roboto-Bold',
        color: '#008AB6',
        marginVertical: height * 0.01,
        fontSize: 18
    },
    pick: {
        marginHorizontal: width * 0.1,
        marginVertical: height * 0.01,
    },
    picker: {
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        borderColor: '#8B8B8B',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: width * 0.03,
        color: 'black',
    },
    switch: {
        alignSelf: 'center',
        marginVertical: height * 0.01
    },
    text2: {
        textAlign: 'center',
        fontFamily: 'Roboto-Bold',
        color: '#008AB6',
        marginVertical: height * 0.01,
        fontSize: 18,
    },
});

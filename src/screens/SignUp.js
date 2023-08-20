import React, { useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, SafeAreaView, Dimensions, ScrollView, KeyboardAvoidingView, Platform, TextInput } from "react-native";

import Ionicons from 'react-native-vector-icons/Ionicons';

import ImagePicker from 'react-native-image-crop-picker';
import { ActivityIndicator } from "react-native-paper";
import DropDownPicker from "react-native-custom-dropdown";

import EditHeader from "../components/header/EditHeader";
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
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [gender, setGender] = useState('');
    const [race, setRace] = useState('')
    const [age, setAge] = useState('')
    const [occupation, setOccupation] = useState('');
    const [genders, setGenders] = useState([
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Gay-Male', value: 'gay-Male' },
        { label: 'Gay-Female', value: 'gay-Female' },
        { label: 'Male identify as Female', value: 'male identify as Female' },
        { label: 'Female identify as Male', value: 'female identify as Male' },
    ]);
    const [races, setRaces] = useState([
        { label: 'Black', value: 'black' },
        { label: 'White', value: 'white' },
        { label: 'Asian', value: 'asian' },
        { label: 'Pacific Islander', value: 'pacific Islander' },
        { label: 'Hispanic Black', value: 'hispanic Black' },
        { label: 'Hispanic White', value: 'hispanic White' },
        { label: 'Indian', value: 'indian' },
        { label: 'Other', value: 'other' },
    ]);
    const [ages, setAges] = useState([
        { label: '13-18', value: '13-18' },
        { label: '18-25', value: '18-25' },
        { label: '25-35', value: '25-35' },
        { label: '35-50', value: '35-50' },
        { label: '50+', value: '50+' },
    ]);
    const goToPickImage = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
        }).then((res) => {
            setImage(res.path);
            setCheck(true);
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
        } else if (occupation.length >= 50) {
            alert("Occupation will be maximum 50 characters");
            return false;
        } else if (gender == '') {
            alert("Select your Gender");
            return false;
        } else if (race == '') {
            alert("Select your Race");
            return false;
        } else if (age == '') {
            alert("Select your Age");
            return false;
        } else if (occupation == '') {
            alert("Please Enter your Occupation");
            return false;
        }
        return true;
    }
    const signUp = async () => {
        if (validate_field()) {
            setIsLoading(true)
            signup(email, password, firstName, lastName, image, check, gender, race, occupation, age)
                .then((user) => {
                    navigation.replace('PhoneNumber');
                    setIsLoading(false)
                })
                .catch((error) => {
                    console.log(error);
                    alert(error.error);
                    setIsLoading(false)
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
                    <EditHeader backIcon='chevron-back' backText='Back' title='Create Profile' onPress={() => navigation.goBack()} />
                    <ScrollView style={styles.container}>
                        <TouchableOpacity style={styles.main} onPress={() => goToPickImage()}>
                            <View
                                resizeMode='contain'
                                style={styles.image}
                            >
                                <Image
                                    source={{ uri: image }}
                                    style={styles.image}
                                />
                            </View>
                            <TouchableOpacity style={styles.camera} onPress={() => goToPickImage()}>
                                <Ionicons name="md-camera" size={22} color="#dbd5d5" style={{ top: height * 0.0021 }} />
                            </TouchableOpacity>
                        </TouchableOpacity>
                        <Input placeholder='First Name' value={firstName} onChangeText={(firstName) => setFirstName(firstName)} />
                        <Input placeholder='Last Name' value={lastName} onChangeText={(lastName) => setLastName(lastName)} />
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
                        <View style={styles.pick}>
                            <DropDownPicker
                                placeholder='Gender....'
                                placeholderStyle={{ color: '#8B8B8B' }}
                                open={open}
                                value={value}
                                items={genders}
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setGenders}
                                style={styles.picker}
                                containerStyle={{ height: height * 0.07 }}
                                arrowColor='#8B8B8B'
                                onChangeItem={(gender) => setGender(gender)}
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
                                open={open}
                                value={value}
                                items={races}
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setRaces}
                                style={styles.picker}
                                containerStyle={{ height: height * 0.07 }}
                                arrowColor='#8B8B8B'
                                onChangeItem={(race) => setRace(race)}
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
                                open={open}
                                value={value}
                                items={ages}
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setAges}
                                style={styles.picker}
                                containerStyle={{ height: height * 0.07 }}
                                arrowColor='#8B8B8B'
                                onChangeItem={(age) => setAge(age)}
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
                        <View style={styles.input}>
                            <TextInput
                                placeholder='Occupation....'
                                placeholderTextColor='#8B8B8B'
                                style={{ flex: 1, height: height * 0.08, textAlignVertical: 'top', color: 'black' }}
                                multiline={true}
                                numberOfLines={4}
                                onChangeText={(occupation) => setOccupation(occupation)}
                            />
                        </View>
                        <View>
                            {isLoading ? (
                                <ActivityIndicator color='#FFC69B' animating={setIsLoading} />
                            ) : (
                                <Button title='Create Your Profile' onPress={signUp} />
                            )
                            }
                        </View>
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
        fontSize: 18,
    },
    text1: {
        textAlign: 'center',
        fontFamily: 'Roboto-Bold',
        color: '#008AB6',
        marginVertical: height * 0.01,
        fontSize: 18,
    },
    pick: {
        marginHorizontal: width * 0.1,
        marginVertical: height * 0.01,
    },
    picker: {
        paddingHorizontal: width * 0.03,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        backgroundColor: '#f5f5f5',
        borderColor: '#8B8B8B',
    },
    input: {
        flex: 1,
        borderColor: "#8B8B8B",
        borderWidth: 1,
        paddingHorizontal: width * 0.02,
        marginHorizontal: width * 0.1,
        marginVertical: height * 0.01,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        height: height * 0.08,
    },
});

export default SignUp;
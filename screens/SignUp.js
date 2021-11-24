import React, {useState} from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, Dimensions, ScrollView } from "react-native";

import Ionicons from 'react-native-vector-icons/Ionicons';

import {widthPercentageToDP as w, heightPercentageToDP as h} from 'react-native-responsive-screen';
import ImagePicker from 'react-native-image-crop-picker';


import { Images } from "../content/Images";
import Header from "../content/contacts/Header";
import Input from "../content/contacts/Input";
import Button from "../content/contacts/Button";


const {height, width} = Dimensions.get('screen');
const SignUp = ({navigation}) => {
    const [image, setImage] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSecureEntry, setIsSecureEntry] = useState(true);
    const goToPickImage = () => {
        // const [image, setImage] = useState('');
        ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        }).then(res => {
        // console.log(res.path);
        setImage(res.path);
        console.log(image);
        });
    };
    const validate_field = () => {
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(firstName == ''){
            alert("Please Enter first name");
            return false;
        } else if(lastName == ''){
            alert("Please Enter last name");
            return false;
        } else if(email == ''){
            alert("Please Enter email");
            return false;
        } else if(reg.test(email) == false){
            alert("Incorrect Email");
            return false;
        } else if(password == ''){
            alert("Please Enter password");
            return false;
        } else if (password.length < 6) {
            alert("Password will be minimum 6 characters");
            return false;
        }
        return true;
    }
    const login = () =>{
        if(validate_field()){
            navigation.navigate('ProfileQuestion');
            console.log(password.length);

    //     setIsLoading(true);
    //     auth()
    //     .signInWithEmailAndPassword(email, password)
    //     .then(() => {
            
    //         navigation.navigate('Share');
    //         console.log('User account created & signed in!');
    //         setIsLoading(false);
    //     })
    //     .catch(error => {
    //         if (error.code === 'auth/email-already-in-use') {
    //             setIsLoading(false);
    //             console.log('That email address is already in use!');
    //     }
    //         if (error.code === 'auth/invalid-email') {
    //             setIsLoading(false);
    //             console.log('That email address is invalid!');
    //     }
    //         if (error.code === 'auth/user-not-found') {
    //             setIsLoading(false);
    //             console.log('That user not found!');
    //     }
    // console.error(error);
    // });
    }
    }
    return(
        <View>
            <Header title='Create Profile' onPress={()=>navigation.goBack()}/>
            <ScrollView>
            <View style={styles.main}>
                <ImageBackground
                    source={image?{uri: image}:Images.profile}
                    resizeMode='contain'
                    style={styles.image}
                >
                </ImageBackground>
                <TouchableOpacity style={styles.camera} onPress={() => goToPickImage()}>
                    <Ionicons name="md-camera" size={22} color="#dbd5d5" />
                </TouchableOpacity>
            </View>
            <Input placeholder='First Name' value={firstName} onChangeText={(firstName)=>setFirstName(firstName)}/>
            <Input placeholder='Last Name' value={lastName} onChangeText={(lastName)=>setLastName(lastName)}/>
            <Input placeholder='E-mail Address' value={email} onChangeText={(email)=>setEmail(email)}/>
            <Input
                placeholder='Password'
                value={password}
                onChangeText={(password)=>setPassword(password)}
                icon={
                    <TouchableOpacity onPress={()=>{
                        setIsSecureEntry((prev)=>!prev)
                    }}>
                        <Ionicons name={isSecureEntry?"eye-outline":"eye-off-outline"} size={20} />
                    </TouchableOpacity>
                }
                secureTextEntry={isSecureEntry}
            />
            <Button title='Create Your Profile' onPress={login}/>
            <Text style={styles.text}>OR</Text>
            <TouchableOpacity onPress={()=>navigation.navigate('PhoneNumber')}>
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
        height: height*0.15,
        width: height*0.15,
        alignSelf: 'center',
        overflow: 'hidden',
        borderRadius: (height*0.15)/2,
    },
    camera: {
        alignItems: 'center',
        // justifyContent: 'center',
        // marginHorizontal: w('46%'),
        marginHorizontal: width*0.46,
        height: width*0.08,
        width: width*0.08,
        backgroundColor: '#C4C4C4',
        borderRadius: (width*0.08)/2,
        bottom: h('5%'),
        left: w('12%'),
        opacity: 0.9,
    },
    text: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'black',
        marginVertical: h('1%'),
        fontSize: 18
    },
    text1: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#008AB6',
        marginVertical: h('1%'),
        fontSize: 18
    },
});


export default SignUp;
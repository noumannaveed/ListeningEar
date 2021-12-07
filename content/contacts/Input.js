import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from "react-native";
import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';


import Ionicons from 'react-native-vector-icons/Ionicons';

const Input = ({ placeholder, onChangeText, value, icon, secureTextEntry }) => {
    return (
        <View style={styles.input}>
            <TextInput
                placeholder={placeholder}
                placeholderTextColor='#8B8B8B'
                onChangeText={onChangeText}
                value={value}
                secureTextEntry={secureTextEntry}
                style={{ flex: 1 }}
            />
            <View style={styles.icon}>{icon}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        flex: 1,
        borderColor: "#8B8B8B",
        borderWidth: 1,
        paddingHorizontal: w('2%'),
        marginHorizontal: w('10%'),
        marginVertical: h('1%'),
        borderRadius: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    icon: {
        color: '#8B8B8B'
    },
});


export default Input;
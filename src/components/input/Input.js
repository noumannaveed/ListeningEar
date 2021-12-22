import React from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';

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
        alignItems: 'center',
        height: h('7.2%')
    },
    icon: {
        color: '#8B8B8B'
    },
});


export default Input;
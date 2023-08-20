import React from "react";
import { View, StyleSheet, Dimensions, TextInput } from "react-native";
const { height, width } = Dimensions.get('screen');
const Input = ({ placeholder, onChangeText, value, icon, secureTextEntry }) => {
    return (
        <View style={styles.input}>
            <TextInput
                placeholder={placeholder}
                placeholderTextColor='#8B8B8B'
                onChangeText={onChangeText}
                value={value}
                secureTextEntry={secureTextEntry}
                style={{ flex: 1, color: 'black' }}
            />
            <View style={styles.icon}>{icon}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        flex: 1,
        borderColor: "#8B8B8B",
        borderWidth: width * 0.003,
        paddingHorizontal: width * 0.02,
        marginHorizontal: width * 0.1,
        marginVertical: height * 0.01,
        borderRadius: width * 0.2/2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: height * 0.072,
    },
    icon: {
        color: '#8B8B8B',
    },
});


export default Input;
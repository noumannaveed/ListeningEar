import React from "react";
import { View, Text, StyleSheet,Dimensions, TouchableOpacity } from "react-native";

const { height, width } = Dimensions.get('screen');
const Button = ({ title, onPress, style }) => {
    return (
        <View>
            <TouchableOpacity
                style={styles.button}
                onPress={onPress}
            >
                <Text style={[styles.text, style]}>{title}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        backgroundColor: "#FFC69B",
        paddingVertical: height * 0.02,
        marginHorizontal: width * 0.17,
        marginVertical: height * 0.01,
        borderRadius: width * 0.17/2,
    },
    text: {
        textAlign: 'center',
        fontFamily: 'Roboto-Bold',
        fontSize: 18,
        color: 'black',
    },
});

export default Button;
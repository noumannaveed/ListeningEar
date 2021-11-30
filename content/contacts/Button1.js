import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';



const Button1 = ({ navigation, title, onPress, style }) => {
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
        borderColor: "#FFC69B",
        borderWidth: 1,
        paddingVertical: h('2%'),
        marginHorizontal: w('17%'),
        marginVertical: h('1%'),
        borderRadius: 50
    },
    text: {
        textAlign: 'center',
        // fontWeight: 'bold',
        fontFamily: 'Roboto-Bold',
        fontSize: 18,
        color: 'black'
    },
});


export default Button1;
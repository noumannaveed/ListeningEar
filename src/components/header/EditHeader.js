import React from "react";
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";

import Ionicons from 'react-native-vector-icons/Ionicons';
const { height, width } = Dimensions.get('screen');

const EditHeader = ({ backIcon, backText, title, onPress }) => {
    return (
        <View>
            <View style={styles.container}>
                <TouchableOpacity style={styles.back} onPress={onPress}>
                    <Ionicons name={backIcon} size={16} color="#948e8e" />
                    <Text style={styles.text}>{backText}</Text>
                </TouchableOpacity>
                <Text style={styles.text1}>{title}</Text>
                <View></View>
                <View></View>
            </View>
            <View style={styles.seprator}></View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: height * 0.02,
    },
    back: {
        flexDirection: 'row',
        alignItems: 'center',
        fontFamily: 'Roboto-Bold',
    },
    text: {
        color: '#948e8e',
        fontSize: 18,
        fontWeight: 'bold',
    },
    text1: {
        color: 'black',
        fontFamily: 'Roboto-Bold',
        fontSize: 18,
        textAlign: 'center'
    },
    seprator: {
        borderWidth: 0.2,
        borderColor: '#000000',
    },
});

export default EditHeader;
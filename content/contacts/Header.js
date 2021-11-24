import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

import Ionicons from 'react-native-vector-icons/Ionicons';

const Header = ({navigation, title, onPress}) => {
    return(
        <View>
            <View style={styles.container}>
                <TouchableOpacity style={styles.back} onPress={onPress}>
                    <Ionicons name="chevron-back" size={16} color="#948e8e" />
                    <Text style={styles.text}>Back</Text>
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
        margin: '4%'
    },
    back: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        color: '#948e8e',
        fontSize: 18,
        fontWeight: 'bold'
    },
    text1: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 18,
    },
    seprator: {
        borderWidth: 0.2,
        borderColor: '#000000'
    },
});


export default Header;
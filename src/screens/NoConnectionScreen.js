import React from "react";

import { View, Text, StyleSheet } from "react-native";

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const NoConnectionScreen = () => {
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.icon}>
                <MaterialCommunityIcons name="wifi-strength-off" size={60} color="#FFC69B" />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    }
})

export default NoConnectionScreen;
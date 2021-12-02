import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";

import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';


const { height, width } = Dimensions.get('screen');
const Listen = ({ navigation, name, source }) => {
    return (
        <View style={styles.Container}>
            <View style={styles.main}>
                <View>
                    <Text style={styles.text}>{name}</Text>
                    <View style={styles.dis}>
                        <Text styles={styles.text1}>Lorem ipsum is a place....</Text>
                        <Text styles={styles.text1}>6 days ago</Text>
                    </View>
                </View>
                <Image
                    source={source}
                    resizeMode='contain'
                    style={styles.image}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    Container: {
        marginHorizontal: w('4.7%'),
        marginVertical: h('1%')
    },
    main: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    text: {
        fontFamily: 'Roboto-Bold',
        color: 'black',
        fontSize: 18,
    },
    dis: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: w('70%'),
        marginVertical: h('1%')
    },
    text1: {
        fontSize: 18,
        fontFamily: 'Roboto-Regular',
    },
    image: {
        // overflow: 'hidden',
        height: height * 0.08,
        width: height * 0.08,
        borderRadius: (height * 0.08) / 2,
        bottom: 7
    }
});


export default Listen;
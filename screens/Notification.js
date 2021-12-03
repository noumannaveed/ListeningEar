import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, AccessibilityInfo } from "react-native";

// import DropDownPicker from 'react-native-dropdown-picker';
import DropDownPicker from "react-native-custom-dropdown";
import { Switch } from 'react-native-paper';

import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';


import Header from "../content/contacts/Header";
import Button from "../content/contacts/Button";

const Notification = ({ navigation }) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' }
    ])
    const [isSwitchOn, setIsSwitchOn] = useState(false);
    const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
    return (
        <View>
            <Header title='Need a Listening Ear?' onPress={() => navigation.goBack()} />
            <Text style={styles.text}>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</Text>
            <View style={styles.pick}>
                <DropDownPicker
                    placeholder='Select one option here....'
                    placeholderStyle={{ color: '#8B8B8B' }}
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    style={styles.picker}
                    containerStyle={{ height: h('7%') }}
                    arrowColor='#8B8B8B'
                    style={{
                        borderTopLeftRadius: 50, borderTopRightRadius: 50,
                        borderBottomLeftRadius: 50, borderBottomRightRadius: 50
                    }}
                    itemStyle={{
                        justifyContent: 'flex-start',
                    }}
                    dropDownStyle={{
                        borderTopLeftRadius: 20, borderTopRightRadius: 20,
                        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
                    }}
                />
            </View>
            <Switch
                value={isSwitchOn}
                onValueChange={onToggleSwitch}
                color='#FFC69B'
                style={styles.switch}
            />
            <Text style={styles.text1}>Enable for Notification</Text>
            <Button title='Submit' onPress={() => navigation.navigate('WaitingRoom')} />
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        marginVertical: h('4%')
    },
    image: {
        height: h('15%'),
        width: w('30%'),
        alignSelf: 'center',
        overflow: 'hidden',
        borderRadius: 55,
        backgroundColor: '#BFBFBF'
    },
    image1: {
        alignSelf: 'center',
        height: h('15%')
    },
    view: {
        flexDirection: 'row',
        // alignItems: 'center',
        marginVertical: h('2%'),
        marginHorizontal: w('10%')
    },
    text: {
        color: '#8B8B8B',
        paddingHorizontal: w('16%'),
        fontSize: 16,
        fontFamily: 'Roboto-Regular',
        textAlign: 'center',
        marginVertical: h('5%'),
    },
    pick: {
        marginHorizontal: w('10%'),
        marginVertical: h('5%'),
    },
    picker: {
        paddingHorizontal: w('3%'),
        borderRadius: 50,
        borderColor: '#C4C4C4'
    },
    switch: {
        alignSelf: 'center',
        marginVertical: h('1%')
    },
    text1: {
        textAlign: 'center',
        fontFamily: 'Roboto-Bold',
        color: '#008AB6',
        marginVertical: h('1%'),
        fontSize: 18,
    },
});


export default Notification;
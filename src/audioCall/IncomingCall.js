import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    ImageBackground
} from 'react-native';
import { useInitializeAgora, useRequestAudioHook } from './hooks';
import InCallManager from 'react-native-incall-manager';
import Button from './Button';
import styles from './styles';
import { Images } from "../assets/Images";
import { FirebaseJoinThread, FirebaseEndThread } from './../auth/FireBase'
import AsyncStorage from '@react-native-async-storage/async-storage';
const App = ({ route, navigation }) => {
    const [type, setType] = useState(route.params.type)
    const [otherUser, setOtherUser] = useState(route.params.user)
    const [CUser, setCUser] = useState({})
    const [callJoined, setcallJoined] = useState('0')
    const [timer, settimer] = useState(0)


    useRequestAudioHook();
    const {
        channelName,
        isMute,
        isSpeakerEnable,
        joinSucceed,
        peerIds,
        setChannelName,
        joinChannel,
        leaveChannel,
        toggleIsMute,
        toggleIsSpeakerEnable,
        OtherUserjoinSucceed,
        destroyAgoraEngine
    } = useInitializeAgora();
    useEffect(() => {
        if (OtherUserjoinSucceed) {
            InCallManager.start({ media: 'audio', ringback: '_BUNDLE_' })
        } else {
            // alert('a')
            destroyAgoraEngine().then(()=>{
                leaveChannel()
                navigation.goBack()
              })
            // leaveChannel()
            // FirebaseEndThread(CUser?.id)
            // destroyAgoraEngine()
            // navigation.goBack()
        }
    }, [OtherUserjoinSucceed])
    const timeer=()=>{
        setInterval(
          () => { settimer(timer + 1) },
          100
        );
      }

    useEffect(async () => {
        let user = await AsyncStorage.getItem('user', null)
        if (user != null) {
            console.log(user)
            let json = JSON.parse(user)
            setCUser(json)
        }
    }, [])
    return (
        <SafeAreaView
            style={styles.container}
        >
            <ImageBackground
                style={styles.mainView}
                source={{ uri: otherUser?.image }}
            >
                <View
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.5)"
                    }}
                >
                    <View
                        style={styles.imageView}
                    >
                        <Image
                            source={{ uri: otherUser?.image }}
                            style={{
                                height: 150,
                                width: 150,
                                borderRadius: 150 / 2
                            }}
                            resizeMode='cover'
                        />
                    </View>
                    <Text
                        style={styles.title}
                    >{otherUser?.firstname}</Text>
                    {peerIds.length > 1 ?
                        <>
                            <Text
                                style={[styles.title, { marginTop: '30%' }]}
                            >Call Started</Text>
                             {/* <Text
                                style={[styles.title, { marginTop: '30%' }]}
                            >{timer}</Text> */}
                        </>
                        :
                        <>
                            <Text
                                style={[styles.title, { marginTop: '30%' }]}
                            >Incoming Call ...</Text>
                        </>
                    }
                    <View
                        style={{
                            position: "absolute",
                            bottom: 0,
                            flexDirection: "row",
                            justifyContent: 'space-between',
                            width: '95%',
                            alignSelf: "center"
                        }}
                    >
                        {peerIds.length > 1 ?
                            <View
                                style={[styles.floatLeft, { alignSelf: "center" }]}
                            >
                                <TouchableOpacity
                                    style={{
                                        height: 70,
                                        width: 70,
                                        borderRadius: 70 / 2,
                                        backgroundColor: "white",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        alignSelf: "center"
                                    }}
                                    onPress={() => {

                                        toggleIsMute()
                                    }}
                                >
                                    <Image
                                        source={isMute ? Images.mic_off : Images.mic}
                                        style={{
                                            height: 40,
                                            width: 40,
                                            resizeMode: "contain"
                                        }}
                                    ></Image>
                                </TouchableOpacity>
                            </View>
                            :
                            null
                        }
                        <View
                            style={[styles.floatLeft, { alignSelf: "center" }]}
                        >
                            <TouchableOpacity
                                style={{
                                    height: 70,
                                    width: 70,
                                    borderRadius: 70 / 2,
                                    backgroundColor: "red",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    alignSelf: "center"
                                }}
                                onPress={() => {
                                    console.log(CUser)
                                    // notification(otherUser.fcmtoken, "call end", "end call", "CancelCall")
                                    // destroyAgoraEngine()
                                    leaveChannel()
                                    FirebaseEndThread(CUser?.id)
                                    navigation.goBack()
                                    // props.onCancel()
                                }}
                            >
                                <Image
                                    source={Images.phone}
                                    style={{
                                        height: 40,
                                        width: 40,
                                        resizeMode: "contain"
                                    }}
                                ></Image>
                            </TouchableOpacity>
                        </View>
                        {/* {cancel()} */}
                        {peerIds.length > 1 ?
                            <>
                                <View
                                    style={[styles.floatLeft, { alignSelf: "center" }]}
                                >
                                    <TouchableOpacity
                                        style={{
                                            height: 70,
                                            width: 70,
                                            borderRadius: 70 / 2,
                                            backgroundColor: "white",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            alignSelf: "center"
                                        }}
                                        onPress={() => {
                                            // joinChannel()
                                            toggleIsSpeakerEnable()
                                        }}
                                    >
                                        <Image
                                            source={isSpeakerEnable ? Images.volume : Images.mute}
                                            style={{
                                                height: 40,
                                                width: 40,
                                                resizeMode: "contain"
                                            }}
                                        ></Image>
                                    </TouchableOpacity>
                                </View>
                            </>

                            :
                            <View
                                style={[styles.floatLeft, { alignSelf: "center" }]}
                            >
                                <TouchableOpacity
                                    style={{
                                        height: 70,
                                        width: 70,
                                        borderRadius: 70 / 2,
                                        backgroundColor: "green",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        alignSelf: "center"
                                    }}
                                    onPress={() => {

                                        joinChannel()
                                        FirebaseJoinThread(CUser.id)
                                        InCallManager.stopRingback();
                                        timeer()
                                        // setcallJoined(true)
                                    }}
                                >
                                    <Image
                                        source={Images.phone}
                                        style={{
                                            height: 40,
                                            width: 40,
                                            resizeMode: "contain"
                                        }}
                                    ></Image>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default App;
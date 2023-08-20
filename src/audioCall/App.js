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
import firestore from '@react-native-firebase/firestore';
import { useInitializeAgora, useRequestAudioHook } from './hooks';
import { FirebaseIncomingThread } from './../auth/FireBase'
import InCallManager from 'react-native-incall-manager';
import styles from './styles';
import { Images } from "../assets/Images";
const App = ({ route, navigation }) => {
  const [type, setType] = useState(route.params.type)
  const [otherUser, setOtherUser] = useState(route.params.user)
  const [User, setUser] = useState(route.params.CUser)
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
  const notification = async (fcmToken, title, body, type, callDetails) => {
    let data
    if (type === "IncomingCall") {
      data = {
        "type": type,
        "call": callDetails
      }
    } else {
      data = {
        "type": type,
      }
    }
    fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "key=AAAAg16Jmto:APA91bH2DBbAekBeKvcpbqH8zC0g0xb3AM6_JdS8TPG2mhRAc6xUJW5lO-O_7pNDkce6f2qEwOEBNoSbHNkhVicKRBx22A6XP-tYjSsj37D2DfJ8RG1pG6SpioucqDPc6NOQrX9vFRbh"
      },
      body: JSON.stringify({
        "to": fcmToken,
        "notification": {
          "title": title,
          "body": body,
        },
        "data": data,
        "mutable_content": false,
        "sound": "Tri-tone"
      }),
    }).then(() => {
      listnerFirebase()
      console.warn('sended');
    })
  }
  const createFirebaseIncomingThread = () => {

    FirebaseIncomingThread(otherUser.id, "mychan", User)
      .then((res) => {
        let callDetails = {
          channelName: "mychan",
          user: User
        }
        notification(otherUser.fcmToken, "Incoming Call from " + User?.firstname, "Audio call", "IncomingCall", callDetails)
        joinChannel()
        InCallManager.start({ media: 'audio', ringback: '_BUNDLE_' })
        timeer()
      })
      .catch(() => {

      })
  }
  const timeer = () => {
    setInterval(
      () => { settimer(timer + 1) },
      1000
    );
  }
  const listnerFirebase = () => {
    // console.log(otherUser.is)
    firestore()
      .collection('Users')
      .doc(otherUser.id)
      .onSnapshot((res) => {
        console.log(res.data()?.callThread?.status)
        let data = res.data()?.callThread
        if (data.status === "End") {
          leaveChannel()
          navigation.goBack()
        }
      })
  }
  useEffect(() => {
    if (OtherUserjoinSucceed) {

    } else {

      destroyAgoraEngine().then(() => {
        leaveChannel()
        navigation.goBack()
      })

    }
    if (peerIds.length > 1) {
      InCallManager.stopRingback();
    }
  }, [OtherUserjoinSucceed, peerIds])

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
            <Text
              style={[styles.title, { marginTop: '30%' }]}
            >{!joinSucceed ? "Call" : "OutGoing Call ..."}</Text>
          }
          {joinSucceed ?
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
              {/* <View
          style={styles.floatRight}
        >
          <Button onPress={toggleIsMute} title={isMute ? 'UnMute' : 'Mute'} />
        </View> */}
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
                    // destroyAgoraEngine()
                    leaveChannel()
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
              {/* <View
          style={styles.floatLeft}
        >
          <Button
            onPress={toggleIsSpeakerEnable}
            title={isSpeakerEnable ? 'Disable Speaker' : 'Enable Speaker'}
          />
        </View> */}
            </View>
            :
            <View
              style={{
                position: "absolute",
                bottom: 0,
                flexDirection: "row",
                justifyContent: 'center',
                width: '95%',
                alignSelf: "center",
                alignItems: "center"
              }}
            >
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
                    createFirebaseIncomingThread()
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
            </View>
          }
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default App;
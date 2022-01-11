import React, { useEffect } from 'react';
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
import Button from './Button';
import styles from './styles';
import { Images } from "../assets/Images";
import InCallManager from 'react-native-incall-manager';
const App = (props) => {
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
    destroyAgoraEngine
  } = useInitializeAgora();

  return (
    <SafeAreaView
      style={styles.container}
    >
      <ImageBackground
        style={styles.mainView}
        source={{ uri: props.otherUser?.image }}
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
              source={{ uri: props.otherUser?.image }}
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
          >{props.otherUser?.name}</Text>
          <Text
            style={[styles.title, { marginTop: '30%' }]}
          >Calling ...</Text>
          {/* <View style={styles.channelInputContainer}>
          <Text>Enter Channel Name:</Text>

          <TextInput
            style={styles.input}
            onChangeText={(text) => setChannelName(text)}
            placeholder={'Channel Name'}
            value={channelName}
          />
        </View> */}

          {/* <View style={styles.joinLeaveButtonContainer}>
          <Button
            onPress={joinSucceed ? leaveChannel : joinChannel}
            title={`${joinSucceed ? 'Leave' : 'Join'} channel`}
          />
        </View> */}
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
                  props.onCancel()
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
          {/* <View style={styles.usersListContainer}>
          {peerIds.map((peerId) => {
            return (
              <View key={peerId}>
                <Text>{`Joined User ${peerId}`}</Text>
              </View>
            );
          })}
        </View> */}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default App;

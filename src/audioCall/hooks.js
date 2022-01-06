import { useEffect, useState, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import RtcEngine from 'react-native-agora';
import { requestAudioPermission } from './permissions';
import InCallManager from 'react-native-incall-manager';
export const useRequestAudioHook = () => {
  useEffect(() => {

    if (Platform.OS === 'android') {
      requestAudioPermission().then(() => {
        console.log('requested!');
      });
    }
    
  }, []);
};

export const useInitializeAgora = () => {
  // Replace yourAppId with the App ID of your Agora project.
  const appId = '07b511f22225447d8bbdef565abeaa49';
  const token =
    '00607b511f22225447d8bbdef565abeaa49IAA30VAyBAuZI3OinfSJeq2wkI1LNEsTOvPccplBmLPkX1Xr0UgAAAAAEABGkIsgdqbGYQEAAQB1psZh';

  const [channelName, setChannelName] = useState('mychan');
  const [joinSucceed, setJoinSucceed] = useState(false);
  const [peerIds, setPeerIds] = useState([]);
  const [isMute, setIsMute] = useState(false);
  const [isSpeakerEnable, setIsSpeakerEnable] = useState(true);
  const rtcEngine = useRef(null);

  const initAgora = useCallback(async () => {
    rtcEngine.current = await RtcEngine.create(appId);
    InCallManager.start({media: 'audio', ringback: '_BUNDLE_'})
   
    await rtcEngine.current?.enableAudio();
    await rtcEngine.current?.muteLocalAudioStream(false);
    await rtcEngine.current?.setEnableSpeakerphone(true);

    rtcEngine.current?.addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJoined', uid, elapsed);
      InCallManager.stopRingback();
      setPeerIds((peerIdsLocal) => {
        if (peerIdsLocal.indexOf(uid) === -1) {
          return [...peerIdsLocal, uid];
        }

        return peerIdsLocal;
      });
    });

    rtcEngine.current?.addListener('UserOffline', (uid, reason) => {
      console.log('UserOffline', uid, reason);

      setPeerIds((peerIdsLocal) => {
        return peerIdsLocal.filter((id) => id !== uid);
      });
    });

    rtcEngine.current?.addListener(
      'JoinChannelSuccess',
      (channel, uid, elapsed) => {
        console.log('JoinChannelSuccess', channel, uid, elapsed);

        setJoinSucceed(true);

        setPeerIds((peerIdsLocal) => {
          return [...peerIdsLocal, uid];
        });
      },
    );

    rtcEngine.current?.addListener('Error', (error) => {
      console.log('Error', error);
    });
  }, []);

  const joinChannel = useCallback(async () => {
    await rtcEngine.current?.joinChannel(token, channelName, null, 0);
  }, [channelName]);

  const leaveChannel = useCallback(async () => {
    InCallManager.stopRingback();
    await rtcEngine.current?.leaveChannel();
    
    setPeerIds([]);
    setJoinSucceed(false);
  }, []);

  const toggleIsMute = useCallback(async () => {
    await rtcEngine.current?.muteLocalAudioStream(!isMute);
    setIsMute(!isMute);
  }, [isMute]);

  const toggleIsSpeakerEnable = useCallback(async () => {
    await rtcEngine.current?.setEnableSpeakerphone(!isSpeakerEnable);
    setIsSpeakerEnable(!isSpeakerEnable);
  }, [isSpeakerEnable]);

  const destroyAgoraEngine = useCallback(async () => {
    await rtcEngine.current?.destroy();
  }, []);

  useEffect(() => {
    initAgora();
  return () => {
   destroyAgoraEngine();
  }
    
  }, [destroyAgoraEngine, initAgora]);

  return {
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
  };
};

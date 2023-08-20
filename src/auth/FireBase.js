import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import storage from '@react-native-firebase/storage';

export const signout = async () => {
    let value = await AsyncStorage.getItem('uid', null);
    let parse = JSON.parse(value);
    await AsyncStorage.clear();
    console.log('value=', parse.user.uid);
    firestore()
        .collection('Users')
        .doc(parse.user.uid)
        .update({
            fcmtoken: 'null',
        })
        .then(async() => {
            console.log('token deleted');
        });
    return new Promise((resolve, reject) => {
        auth()
            .signOut()
            .then(async () => {
                console.log('User signed out!');
                resolve({ status: true })
            })
            .catch(error => {
                reject({ status: false })
            })
    })
};

export const login = async (email, password, setIsLoading) => {
    const fcmToken = await messaging().getToken();
    console.log('Token=', fcmToken);
    setIsLoading(true);
    return new Promise((resolve, reject) => {
        auth()
            .signInWithEmailAndPassword(email, password)
            .then(async (user) => {
                try {
                    firestore()
                        .collection('Users')
                        .doc(user.user.uid)
                        .get()
                        .then(async (us) => {
                            let user = us.data()
                            user = {
                                ...user,
                                id: us.id
                            }
                            if (us) {
                                await AsyncStorage.setItem(
                                    'user',
                                    JSON.stringify(user)
                                );
                            }
                        })
                    await AsyncStorage.setItem(
                        'uid',
                        JSON.stringify(user)
                    );

                } catch (error) {
                    // Error saving data
                }
                firestore()
                    .collection('Users')
                    .doc(user.user.uid)
                    .update({
                        fcmtoken: fcmToken,
                    })
                    .then(() => {
                        console.log('token update');
                    });
                console.log('User account created & signed in!');
                setIsLoading(false);
                resolve({ status: true, user: user });
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    setIsLoading(false);
                    console.log('That email address is already in use!');
                    reject({ status: false, error: "That email address is already in use!" });
                }
                if (error.code === 'auth/invalid-email') {
                    setIsLoading(false);
                    console.log('That email address is invalid!');
                    reject({ status: false, error: "That email address is invalid!" });
                }
                if (error.code === 'auth/user-not-found') {
                    setIsLoading(false);
                    console.log('That email address is invalid!');
                    reject({ status: false, error: "That email address is invalid!" });
                }
                if (error.code === 'auth/wrong-password') {
                    setIsLoading(false);
                    console.log('That email address is invalid!');
                    reject({ status: false, error: "Wrong password!" });
                }
            });
    })
};

export const signup = async (email, password, firstName, lastName, image, check, gender, race, occupation, age) => {
    let url = '';
    if (check) {
        try {
            const uploadUri = image;
            let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
            await storage().ref(filename).putFile(uploadUri);
            url = await storage().ref(filename).getDownloadURL();
        } catch (error) {
            console.log('error=', error);
        }
    }
    const fcmToken = await messaging().getToken();
    return new Promise((resolve, reject) => {
        auth()
            .createUserWithEmailAndPassword(email, password)
            .then(async (user) => {
                console.log('url=', url);
                try {
                    await AsyncStorage.setItem(
                        'uid',
                        JSON.stringify(user),
                    );
                } catch (error) {
                    // Error saving data
                }
                firestore()
                    .collection('Users')
                    .doc(user.user.uid)
                    .set({
                        firstname: firstName,
                        lastname: lastName,
                        email: email,
                        image: url,
                        fcmtoken: fcmToken,
                        gender: gender,
                        race: race,
                        occupation: occupation,
                        age: age,
                        enable: true,
                    })
                    .then(() => {
                        console.log('User added!');
                    });
                console.log('uid=', user.user.uid);
                resolve({ status: true, user: user });
            })
            .catch(error => {
                console.log(error);
                if (error.code === 'auth/email-already-in-use') {
                    console.log('That email address is already in use!');
                    reject({ status: false, error: "That email address is already in use!" });
                }
            });
    })
};

export const sendMessage = (connectionId, message) => {
    return new Promise((resolve) => {
        console.log('message=', message);
        firestore()
            .collection('Connection')
            .doc(connectionId)
            .collection('Messages')
            .add({ ...message, createdAt: firestore.FieldValue.serverTimestamp() })
        firestore()
            .collection('Connection')
            .doc(connectionId)
            .update({ lastMessage: message })
        resolve({ status: true });
    })
};

export const FirebaseIncomingThread = (Ouid, channelName, CurrentUser) => {
    return new Promise((resolve) => {
        firestore()
            .collection('Users')
            .doc(Ouid)
            .set({
                callThread: {
                    caller: CurrentUser,
                    channelName: channelName,
                    status: "calling"
                }
            }, { merge: true }).then(() => {
                resolve({ status: true })
            }).catch((err) => {
                console.log(err)
                reject({ status: false })
            })
    })
};

export const FirebaseJoinThread = (Ouid) => {
    return new Promise((resolve) => {
        firestore()
            .collection('Users')
            .doc(Ouid)
            .set({
                callThread: {
                    status: "Join"
                }
            }, { merge: true }).then(() => {
                resolve({ status: true })
            }).catch((err) => {
                console.log(err)
                reject({ status: false })
            })
    })
};

export const FirebaseEndThread = (Ouid, channelName, CurrentUser) => {
    return new Promise((resolve) => {
        firestore()
            .collection('Users')
            .doc(Ouid)
            .set({
                callThread: {
                    status: "End"
                }
            }, { merge: true }).then(() => {
                resolve({ status: true })
            }).catch((err) => {
                console.log(err)
                reject({ status: false })
            })
    })
};
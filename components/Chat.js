//import gifted Messages library
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
// gives users offline access to their sent/received message
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useEffect, useState } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, } from 'react-native';
import { collection, addDoc, onSnapshot, query, orderBy, } from "firebase/firestore";

import MapView from 'react-native-maps';
import CustomActions from './CustomActions';

const Chat = ({ route, db, navigation, isConnected, storage }) => {
    const { name, color, userID } = route.params;
    const [messages, setMessages] = useState([]);

    /**
     * 
     * @param {previousMessage} newMessages 
     */
    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0]);
    }

    const renderBubble = (props) => {
        return <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: "#000"
                },
                left: {
                    backgroundColor: "#FFF"
                }
            }}
        />
    }

    const renderInputToolbar = (props) => {
        if (isConnected === true) return <InputToolbar {...props} />;
        else return null;
    }

    const renderCustomActions = (props) => {
        return <CustomActions userID={userID} storage={storage} {...props} />;
    };

    const renderCustomView = (props) => {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    }

    // works with bubble and gifted chat 
    // unregister current onSnapshot() listener to avoid registering multiple listeners when
    // useEffect code is re-executed.
    let unsubMessages;

    useEffect(() => {
        navigation.setOptions({ title: name });
        if (isConnected === true) {

            if (unsubMessages) unsubMessages();
            unsubMessages = null;
            const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
            unsubMessages = onSnapshot(q, (docs) => {
                let newMessages = [];
                docs.forEach(doc => {
                    newMessages.push({
                        id: doc.id,
                        text: doc.text,
                        image: doc.image,
                        location: doc.location,
                        ...doc.data(),
                        createdAt: new Date(doc.data().createdAt.toMillis()),
                    })
                })
                cacheMessages(newMessages);
                setMessages(newMessages);
            })
        } else loadCachedMessages();
        return () => {
            if (unsubMessages) unsubMessages();
        }
    }, [isConnected]);

    //try-catch function as a safety measure to prevent the app from crashing in case AsyncStorage fails to store the data
    //JSON.stringify() converts object to string 

    const cacheMessages = async (messagesToCache) => {
        try {
            await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
        } catch (error) {
            console.log(error.message);
        };
    }

    const loadCachedMessages = async () => {
        const cachedMessages = await AsyncStorage.getItem("messages") || [];
        if (cachedMessages) {
            setMessages(JSON.parse(cachedMessages));
        }
    }

    return (
        <View style={[styles.container, { backgroundColor: color }]}>
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                renderActions={renderCustomActions}
                renderCustomView={renderCustomView}
                onSend={messages => onSend(messages)}
                user={{
                    _id: userID,
                    name: name
                }}
            />
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

});
export default Chat




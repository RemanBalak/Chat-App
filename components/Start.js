import { useState } from 'react';
import {
  ImageBackground,
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { getAuth, signInAnonymously } from 'firebase/auth';
//navigation prop is passed to every component included in the Stack.Navigator, and contains a set of methods used to navigate to other screens

const backgroundColors = {
  black: { backgroundColor: '#090C08' },
  purple: { backgroundColor: '#474056' },
  steel: { backgroundColor: '#8A95A5' },
  green: { backgroundColor: '#B9C6AE' },
};

const Start = ({ navigation }) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const auth = getAuth();

  const signInUser = () => {
    signInAnonymously(auth)
      .then((result) => {
        navigation.navigate('Chat', {
          userID: result.user.uid,
          name: name,
          color: color,
        });
        Alert.alert('Signed in Successfully!');
      })
      .catch((error) => {
        Alert.alert(
          'Unable to sign in, try later again.' + error.message.toString()
        );
      });
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ImageBackground
          source={require('../assets/Background-Image.png')}
          resizeMode="cover"
          style={styles.image}
        >
          <Text style={styles.title}>Chat App</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Type your username here"
              icon={
                <Image
                  style={styles.icon}
                  source={require('../assets/icon.svg')}
                />
              }
            />

            <View style={styles.colorSelectorWrapper}>
              <Text style={styles.colorSelectorTitle}>
                Choose your Background:
              </Text>
              <View style={styles.colorSelector}>
                <TouchableOpacity
                  style={[
                    styles.color,
                    backgroundColors.black,
                    color === backgroundColors.black.backgroundColor
                      ? styles.colorSelected
                      : {},
                  ]}
                  onPress={() =>
                    setColor(backgroundColors.black.backgroundColor)
                  }
                />
                <TouchableOpacity
                  style={[
                    styles.color,
                    backgroundColors.purple,
                    color === backgroundColors.purple
                      ? styles.colorSelected
                      : {},
                  ]}
                  onPress={() =>
                    setColor(backgroundColors.purple.backgroundColor)
                  }
                />
                <TouchableOpacity
                  style={[
                    styles.color,
                    backgroundColors.steel,
                    color === backgroundColors.steel.backgroundColor
                      ? styles.colorSelected
                      : {},
                  ]}
                  onPress={() =>
                    setColor(backgroundColors.steel.backgroundColor)
                  }
                />
                <TouchableOpacity
                  style={[
                    styles.color,
                    backgroundColors.green,
                    color === backgroundColors.green.backgroundColor
                      ? styles.colorSelected
                      : {},
                  ]}
                  onPress={() =>
                    setColor(backgroundColors.green.backgroundColor)
                  }
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.button}
              accessible={true}
              accessibilityLabel="Start Chatting"
              accessibilityHint="Click the button to navigate to chat screen"
              onPress={signInUser}
            >
              <Text style={styles.buttonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

// keyboard avoiding view - automatically adjusts to remain visible while the virtual keyboard is displayed

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 45,
    fontWeight: 600,
    color: '#FFFFFF',
    marginTop: 60,
    textAlign: 'center',
  },
  inputBox: {
    height: '44%',
    width: '88%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  textInput: {
    width: '88%',
    padding: 15,
    borderWidth: 1,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 50,
  },
  colorSelectorWrapper: {
    width: '88%',
  },
  colorSelectorTitle: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
  },
  colorSelector: {
    flexDirection: 'row',
  },
  color: {
    width: 40,
    height: 40,
    borderRadius: 25,
    margin: 10,
  },
  button: {
    height: '20%',
    width: '88%',
    backgroundColor: '#757083',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
});

export default Start;

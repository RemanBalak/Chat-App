// Import two screens "start" and "chat"
import Start from './components/Start';
import Chat from './components/Chat';
import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Create navigation stack

const Stack = createNativeStackNavigator();

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Start"
          screenOptions={{ headerTitleAlign: 'center' }}
        >
          <Stack.Screen
            name="Start"
            component={Start}
            options={{ headerShown: false }} // Hide header
          />
          <Stack.Screen
            name="Chat"
            component={Chat}
            //Title of header
            options={({ route }) => ({ title: route.params.name })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

import React from "react";
import { View, SafeAreaView, StatusBar, Text } from "react-native";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react-native";
import outputs from "./amplify_outputs.json";
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "./src/screens/HomeScreen";
import UploadScreen from './src/screens/UploadScreen';

const Stack = createNativeStackNavigator();


LogBox.ignoreAllLogs(true);
Amplify.configure(outputs);

import { signInWithRedirect } from "aws-amplify/auth"

signInWithRedirect({
    provider: { custom: "MicrosoftEntraIDSAML" }
})

const App = () => {
    return (
        <View className="h-full bg-white">
            {/* <Authenticator.Provider>
                <Authenticator
                > */}
                    <StatusBar barStyle="light-content" backgroundColor="white" />
                    <SafeAreaView className="h-full">
                        <NavigationContainer>
                            <Stack.Navigator>
                                <Stack.Screen
                                    name="Home"
                                    component={HomeScreen}
                                    options={{ title: 'Photo Feed' }}
                                />
                                <Stack.Screen
                                    name="Upload"
                                    component={UploadScreen}
                                    options={{ title: 'Upload Photo' }}
                                />
                            </Stack.Navigator>
                        </NavigationContainer>
                    </SafeAreaView>
                {/* </Authenticator>
            </Authenticator.Provider> */}
        </View>
    );
};


export default App;
import React, { useRef, useEffect } from "react";
import { View, SafeAreaView, StatusBar, Platform } from "react-native";
import { Amplify } from "aws-amplify";
import outputs from "./amplify_outputs.json";
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "./src/screens/HomeScreen";
import UploadScreen from './src/screens/UploadScreen';

const Stack = createNativeStackNavigator();

LogBox.ignoreAllLogs(true);
Amplify.configure(outputs);

const App = () => {
    const rootRef = useRef(null);

    useEffect(() => {
        if (Platform.OS === 'web') {
            // Only run this code on web
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = './tailwind.css';  // Path to your tailwind.css file
            document.head.appendChild(link);

            // Cleanup on unmount (if needed)
            return () => {
                document.head.removeChild(link);
            };
        }
    }, []); 

    return (
        <View ref={rootRef} style={{flex: 1, backgroundColor: 'white' }}>
            <StatusBar barStyle="light-content" backgroundColor="white" />
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
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
        </View>
    );
};

export default App;

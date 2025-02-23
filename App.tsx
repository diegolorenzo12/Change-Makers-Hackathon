import React, { useRef, useEffect } from "react";
import { View, SafeAreaView, StatusBar, Platform, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Amplify } from "aws-amplify";
import outputs from "./amplify_outputs.json";
import { LogBox } from 'react-native';
import { NavigationContainer, useNavigation, NavigationProp } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "./src/screens/HomeScreen";
import UploadScreen from './src/screens/UploadScreen';
import NotificationsScreen from './src/screens/NotificationsScreen'; // You'll need to create this
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();

LogBox.ignoreAllLogs(true);
Amplify.configure(outputs);

// Define navigation type
type RootStackParamList = {
  Home: undefined;
  Upload: undefined;
  Notifications: undefined;
};

const CustomHeader = ({ title, showBackButton }: { title: string; showBackButton?: boolean }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={styles.headerContainer}>
      {showBackButton ? (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      ) : (
        <View style={styles.headerButton} /> // Empty view for spacing
      )}
      <View style={styles.logoContainer}>
        <Image
          source={require('./assets/logo.png')}
          style={styles.logo} 
        />
      </View>
      <TouchableOpacity 
        onPress={() => navigation.navigate('Notifications')} 
        style={styles.headerButton}
      >
        <Ionicons name="notifications" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const App = () => {
    const rootRef = useRef(null);

    useEffect(() => {
        if (Platform.OS === 'web') {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = './tailwind.css';
            document.head.appendChild(link);

            return () => {
                document.head.removeChild(link);
            };
        }
    }, []); 

    return (
        <View ref={rootRef} style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#539dd6" />
            <SafeAreaView style={styles.safeArea}>
                <NavigationContainer>
                    <Stack.Navigator
                        screenOptions={{
                            headerStyle: styles.headerStyle,
                            headerTintColor: 'white',
                            headerTitleStyle: styles.headerTitleStyle,
                        }}
                    >
                        <Stack.Screen
                            name="Home"
                            component={HomeScreen}
                            options={{
                                header: () => <CustomHeader title="Home" />,
                            }}
                        />
                        <Stack.Screen
                            name="Upload"
                            component={UploadScreen}
                            options={{
                                header: () => <CustomHeader title="Upload Photo" showBackButton />,
                            }}
                        />
                        <Stack.Screen
                            name="Notifications"
                            component={NotificationsScreen}
                            options={{
                                header: () => <CustomHeader title="Notifications" showBackButton />,
                            }}
                        />
                    </Stack.Navigator>
                </NavigationContainer>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
    },
    headerStyle: {
        backgroundColor: '#539dd6',  
        height: 80,
        elevation: 0,
    },
    headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 24,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#539dd6',
        height: 80,
        paddingHorizontal: 15,
    },
    logoContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 100,
        height: 40,
        resizeMode: 'contain',
    },
    headerButton: {
        padding: 10,
        width: 44, // Fixed width for consistent layout
        alignItems: 'center',
    },
});

export default App;
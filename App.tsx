import React from "react";
import { View, SafeAreaView, StatusBar, Text } from "react-native";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react-native";
import outputs from "./amplify_outputs.json";
import { LogBox } from 'react-native';


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
                        <Text>OLi</Text>
                    </SafeAreaView>
                {/* </Authenticator>
            </Authenticator.Provider> */}
        </View>
    );
};


export default App;
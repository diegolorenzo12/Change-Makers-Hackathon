import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Dimensions, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraType, useCameraPermissions, CameraView, Camera } from 'expo-camera';

export default function UploadScreen({ navigation }) {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    
    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
          <View >
            <Text >We need your permission to show the camera</Text>
            <Button onPress={requestPermission} title="grant permission" />
          </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }


    const handleUpload = () => {
        // Here you would typically handle the image upload
        // and create a new post
        navigation.goBack();
    };

    // Get the screen width to ensure the image is square
    const screenWidth = Dimensions.get('window').width;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
                            <View 
                    style={{
                        flex: 1,
                        justifyContent: 'center'    
                    }}>
                    <CameraView 
                        style={{
                            flex: 1,
                            }} 
                        facing={facing}>

                        <View 
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                backgroundColor: 'transparent',
                                margin: 64,
                            }}>
                        <TouchableOpacity 
                            style={{
                                flex: 1,
                                alignSelf: 'flex-end',
                                alignItems: 'center',
                            }} 
                            onPress={toggleCameraFacing}>
                            <Text 
                                style={{
                                    fontSize: 24,
                                    fontWeight: 'bold',
                                    color: 'white',
                                }}>
                                    Flip Camera
                            </Text>
                        </TouchableOpacity>
                        </View>
                    </CameraView>
                </View>
            <View style={{ padding: 16 }}>

                <TextInput
                    style={{
                        backgroundColor: 'white',
                        padding: 16,
                        borderRadius: 12,
                        marginBottom: 16,
                    }}
                    placeholder="Write a caption..."
                    value={caption}
                    onChangeText={setCaption}
                    multiline
                />

                <TouchableOpacity
                    style={{
                        backgroundColor: '#3b82f6',
                        padding: 16,
                        borderRadius: 12,
                        alignItems: 'center',
                    }}
                    onPress={handleUpload}
                >
                    <Text style={{ color: 'white', fontWeight: '600' }}>Upload Post</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraType, useCameraPermissions, CameraView } from 'expo-camera';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

type CapturedImage = {
    uri: string;
    base64?: string;
    width: number;
    height: number;
};

export default function UploadScreen({ navigation }) {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState<CapturedImage | null>(null);
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null); // Add the correct type
    const [loading, setLoading] = useState(false);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ marginBottom: 16 }}>We need your permission to show the camera</Text>
                <TouchableOpacity
                    style={{ backgroundColor: '#3b82f6', padding: 16, borderRadius: 12 }}
                    onPress={requestPermission}
                >
                    <Text style={{ color: 'white', fontWeight: '600' }}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const toggleCameraFacing = () => {
        setFacing((current) => (current === 'back' ? 'front' : 'back'));
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync({
                base64: true,
                quality: 0.5, // Reduce quality to decrease buffer size
                imageType: 'jpg'
            });
            setImage(photo as CapturedImage); // Type assertion to match CapturedImage type
        }
    };

    const handleUpload = async () => {
        if (!image || !caption) {
            Alert.alert('Error', 'Please capture an image and write a caption.');
            return;
        }

        setLoading(true);

        try {
            // Get the base64 string directly from the captured image
            const base64 = image.base64; // Use the base64 data from the captured image

            if (!base64) {
                throw new Error('Failed to get base64 data from the image.');
            }

            // Debugging: Log the base64 string
            //console.log('Base64 string:', base64);

            // Call the createPost mutation

            const { data, errors } = await client.mutations.createPostWithImage({
                title: caption,
                imageBase64: base64,
            })

            if (errors) {
                throw new Error(errors[0].message);
            }

            if (data) {
                Alert.alert('Success', 'Post created successfully!');
                navigation.goBack();
            }
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Failed to create post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <CameraView
                    style={{ flex: 1 }}
                    facing={facing}
                    ref={cameraRef}
                >
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            backgroundColor: 'transparent',
                            margin: 64,
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                alignSelf: 'flex-end',
                                alignItems: 'center',
                            }}
                            onPress={toggleCameraFacing}
                        >
                            <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'white' }}>Flip Camera</Text>
                        </TouchableOpacity>
                    </View>
                </CameraView>
            </View>

            <View style={{ padding: 16 }}>
                <TouchableOpacity
                    style={{
                        backgroundColor: '#3b82f6',
                        padding: 16,
                        borderRadius: 12,
                        alignItems: 'center',
                        marginBottom: 16,
                    }}
                    onPress={takePicture}
                >
                    <Text style={{ color: 'white', fontWeight: '600' }}>Capture Photo</Text>
                </TouchableOpacity>

                {image && (
                    <Image
                        source={{ uri: image.uri }}
                        style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 16 }}
                    />
                )}

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
                    disabled={loading}
                >
                    <Text style={{ color: 'white', fontWeight: '600' }}>
                        {loading ? 'Uploading...' : 'Upload Post'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
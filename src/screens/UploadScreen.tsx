import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Dimensions, Button, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraType, useCameraPermissions, CameraView } from 'expo-camera';
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '@/amplify/data/resource';
import { v4 as uuid } from 'uuid';
import { uploadData } from 'aws-amplify/storage';


const client = generateClient<Schema>();

type CapturedImage = {
    uri: string;
    base64?: string;
    width: number;
    height: number;
};

export default function UploadScreen({ navigation }) {
    const [caption, setCaption] = useState('');
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const cameraRef = useRef<CameraView>(null); // Add the correct type
    const [loading, setLoading] = useState(false);


    // Check the screen width
    const { width, height } = Dimensions.get('window');
    const isDesktop = width >= 1024; // Set the threshold for desktop screen

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
            console.log(photo?.uri)
            if (photo?.uri) {
                setPhotoUri(photo.uri);
            } else {
                console.error('Photo URI is undefined');
            }
        }
    };

    const handleUpload = async () => {
        if (!photoUri) {
            Alert.alert('Error', 'Please capture an image');
            return;
        }
        if (!caption) {
            Alert.alert('Error', 'Please write a caption');
            return;
        }

        setLoading(true);

        const response = await fetch(photoUri);
        const blob = await response.blob();

        try {
            const imageKey = `images/${uuid()}.jpg`;

            const uploadResult = await uploadData({
                key: imageKey,
                data: blob,
                options: {
                    contentType: 'image/jpeg',
                    accessLevel: 'guest'
                }
            }).result;

            console.log(uploadResult);

            const createdAt = new Date().toISOString();
            const newPost = await client.models.Post.create({
                title: caption,
                imageKey: `public/${imageKey}`,
                createdAt
            });


            console.log(newPost)

            if (newPost) {
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
        <SafeAreaView style={[styles.container, , isDesktop && styles.desktopFormContainer]}>
            <View style={styles.cameraContainer}>
                <CameraView style={styles.cameraView} facing={facing} ref={cameraRef} >
                    <View style={styles.cameraControls}>
                        <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
                            <Text style={styles.flipText}>Flip Camera</Text>
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

                {photoUri && (
                    <Image
                        source={{ uri: photoUri }}
                        style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 16 }}
                    />
                )}

                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.captionInput}
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
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    cameraContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    cameraView: {
        flex: 1,
        width: '100%',
    },
    cameraControls: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    flipButton: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    flipText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    formContainer: {
        padding: 16,
    },
    captionInput: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    uploadButton: {
        backgroundColor: '#3b82f6',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    uploadButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    desktopFormContainer: {
        width: '50%',
        alignSelf: 'center',
    },
});

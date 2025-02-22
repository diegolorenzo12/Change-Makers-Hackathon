import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Dimensions, Button, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraType, useCameraPermissions, CameraView, Camera } from 'expo-camera';

export default function UploadScreen({ navigation }) {
    const [caption, setCaption] = useState('');
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();

    // Check the screen width
    const { width, height } = Dimensions.get('window');
    const isDesktop = width >= 1024; // Set the threshold for desktop screen

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View>
                <Text>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    const handleUpload = () => {
        // Handle image upload and post creation
        navigation.goBack();
    };

    return (
        <SafeAreaView style={[styles.container, , isDesktop && styles.desktopFormContainer]}>
            <View style={styles.cameraContainer}>
                <CameraView style={styles.cameraView} facing={facing}>
                    <View style={styles.cameraControls}>
                        <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
                            <Text style={styles.flipText}>Flip Camera</Text>
                        </TouchableOpacity>
                    </View>
                </CameraView>
            </View>

            <View style={styles.formContainer}>
                <TextInput
                    style={styles.captionInput}
                    placeholder="Write a caption..."
                    value={caption}
                    onChangeText={setCaption}
                    multiline
                />
                <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
                    <Text style={styles.uploadButtonText}>Upload Post</Text>
                </TouchableOpacity>
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
        width: '100%', // Full width on mobile, dynamic width for desktop
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
        width: '50%', // 2/4 of the screen width on desktop
        alignSelf: 'center',
    },
});

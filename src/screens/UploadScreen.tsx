import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera } from 'lucide-react-native';

export default function UploadScreen({ navigation }) {
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);

    const handleUpload = () => {
        // Here you would typically handle the image upload
        // and create a new post
        navigation.goBack();
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <View className="p-4">
                <TouchableOpacity
                    className="h-60 bg-gray-200 rounded-lg items-center justify-center mb-4"
                    onPress={() => {
                        // Here you would typically implement image picker
                        console.log('Pick image');
                    }}
                >
                    {image ? (
                        <Image source={{ uri: image }} className="w-full h-full rounded-lg" />
                    ) : (
                        <View className="items-center">
                            <Camera size={48} color="#9CA3AF" />
                            <Text className="text-gray-500 mt-2">Tap to select a photo</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <TextInput
                    className="bg-white p-4 rounded-lg mb-4"
                    placeholder="Write a caption..."
                    value={caption}
                    onChangeText={setCaption}
                    multiline
                />

                <TouchableOpacity
                    className="bg-blue-500 p-4 rounded-lg items-center"
                    onPress={handleUpload}
                >
                    <Text className="text-white font-semibold">Upload Post</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
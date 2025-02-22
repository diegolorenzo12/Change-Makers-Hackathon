import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react-native';

interface PostProps {
    post: {
        imageUrl: string;
        caption: string;
        author: {
            name: string;
            avatar: string;
        };
        votes: number;
    };
    onUpvote: () => void;
    onDownvote: () => void;
}

export default function Post({ post, onUpvote, onDownvote }: PostProps) {
    return (
        <View className="bg-white mb-4">
            {/* Author header */}
            <View className="flex-row items-center p-4">
                <Image
                    source={{ uri: post.author.avatar }}
                    className="w-10 h-10 rounded-full"
                />
                <Text className="ml-3 font-semibold">{post.author.name}</Text>
            </View>

            {/* Post image */}
            <Image
                source={{ uri: post.imageUrl }}
                className="w-full aspect-square"
            />

            {/* Voting and caption */}
            <View className="p-4">
                <View className="flex-row items-center mb-2">
                    <TouchableOpacity onPress={onUpvote} className="mr-2">
                        <ArrowUpCircle size={24} color="#3B82F6" />
                    </TouchableOpacity>
                    <Text className="text-lg font-bold mx-2">{post.votes}</Text>
                    <TouchableOpacity onPress={onDownvote} className="ml-2">
                        <ArrowDownCircle size={24} color="#3B82F6" />
                    </TouchableOpacity>
                </View>
                <Text className="text-gray-800">{post.caption}</Text>
            </View>
        </View>
    );
}
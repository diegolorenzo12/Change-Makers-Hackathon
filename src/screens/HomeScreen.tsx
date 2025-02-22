import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Post from '../components/Post';
import ChallengeCard from '../components/ChallengeCard';

const todaysChallenge = {
    title: "Park Clean-up Challenge",
    description: "Visit your local park and collect at least one bag of litter. Remember to separate recyclables!",
    deadline: "8 hours",
    category: "Clean Environment",
    impact: "Reduce waste",
};

const initialPosts = [
    {
        id: '1',
        imageUrl: 'https://picsum.photos/400/400',
        challengeTitle: "Park Clean-up Challenge",
        caption: "Spent my morning cleaning Thompson Park! Found lots of plastic bottles - all properly recycled now! 💚♻️",
        author: {
            name: "Sarah Green",
            avatar: 'https://i.pravatar.cc/100?u=sarah',
        },
        votes: 15,
        timeAgo: "2 hours ago",
        impact: "2kg waste collected",
        category: "Clean Environment",
    },
    {
        id: '2',
        imageUrl: 'https://picsum.photos/400/400?random=1',
        challengeTitle: "Plant a Seedling",
        caption: "Just planted my first tomato seedling! Can't wait to see it grow 🌱🍅",
        author: {
            name: "Mike Earth",
            avatar: 'https://i.pravatar.cc/100?u=mike',
        },
        votes: 8,
        timeAgo: "5 hours ago",
        impact: "1 plant added",
        category: "Urban Gardening",
    },
];

export default function HomeScreen({ navigation }) {
    const [posts, setPosts] = useState(initialPosts);

    const handleVote = (postId: string, increment: boolean) => {
        setPosts(posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    votes: post.votes + (increment ? 1 : -1),
                };
            }
            return post;
        }));
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1">
                <View className="p-4">
                    <ChallengeCard challenge={todaysChallenge} />
                </View>
                {posts.map(post => (
                    <Post
                        key={post.id}
                        post={post}
                        onUpvote={() => handleVote(post.id, true)}
                        onDownvote={() => handleVote(post.id, false)}
                    />
                ))}
            </ScrollView>
            <TouchableOpacity
                onPress={() => navigation.navigate('Upload')}
                className="absolute bottom-6 right-6 bg-green-500 rounded-full p-4"
            >
                <Text className="text-white text-2xl">+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
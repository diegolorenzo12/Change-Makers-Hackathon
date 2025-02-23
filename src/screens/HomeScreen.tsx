import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Post from '../components/Post';
import ChallengeCard from '../components/ChallengeCard';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import for the heart icon

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Define if it's desktop or mobile
const isDesktop = width >= 1024; // You can adjust this threshold as per your needs

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
        imageUrl: require('../../assets/kids.jpeg'),
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
        isLiked: false, // Add isLiked state
    },
    {
        id: '2',
        imageUrl: require('../../assets/planting.jpg'),
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
        isLiked: false, // Add isLiked state
    },
];

export default function HomeScreen({ navigation }) {
    const [posts, setPosts] = useState(initialPosts);

    const handleVote = (postId: string) => {
        setPosts(posts.map(post => {
            if (post.id === postId) {
                return {
                    ...post,
                    votes: post.isLiked ? post.votes - 1 : post.votes + 1, // Increment or decrement votes based on whether it is liked
                    isLiked: !post.isLiked, // Toggle the like state
                };
            }
            return post;
        }));
    };

    return (
        <SafeAreaView style={[styles.container, isDesktop && styles.desktopCardWrapper]}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={[styles.challengeCardWrapper]}>
                    <ChallengeCard challenge={todaysChallenge} />
                </View>
                {posts.map(post => (
                    <Post
                        key={post.id}
                        post={post}
                        onUpvote={() => handleVote(post.id)} // Only handle the upvote
                        renderHeartIcon={
                            <TouchableOpacity onPress={() => handleVote(post.id)} style={styles.heartButton}>
                                <Icon name="heart" size={30} color={post.isLiked ? 'green' : '#ccc'} />
                            </TouchableOpacity>
                        }
                    />
                ))}
            </ScrollView>
            <TouchableOpacity
                onPress={() => navigation.navigate('Upload')}
                style={styles.uploadButton}
            >
                <Text style={styles.uploadButtonText}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    scrollContainer: {
        paddingBottom: 100,  // Some extra padding for the button at the bottom
    },
    challengeCardWrapper: {
        padding: 16,
        width: '100%',  // Full width for mobile
    },
    desktopCardWrapper: {
        width: '50%',  // 2/4 of the screen width on desktop
        alignSelf: 'center',  // Center the card on desktop
    },
    uploadButton: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        backgroundColor: '#85da59',
        borderRadius: 50,
        padding: 16,
        width: 60, // Width for circular button
        height: 60, // Height for circular button
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadButtonText: {
        color: '#ffffff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    heartButton: {
        marginTop: 10,
        alignItems: 'center',
    },
});

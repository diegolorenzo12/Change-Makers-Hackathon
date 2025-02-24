import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Post from '../components/Post';
import ChallengeCard from '../components/ChallengeCard';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import for the heart icon

import { generateClient, post } from 'aws-amplify/api';
import type { Schema } from '@/amplify/data/resource';
import { getUrl } from 'aws-amplify/storage';


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

const client = generateClient<Schema>();

export default function HomeScreen({ navigation }) {
    const [posts, setPosts] = useState(initialPosts);

    const [postsDb, setPostsDb] = useState<(Schema["Post"]["type"] & { imageUrl?: string })[]>([]);

    const fetchTodos = async () => {
        const { data: items, errors } = await client.models.Post.list();

        if (errors) {
            console.error("Error fetching posts:", errors);
            return;
        }

        const updatedPosts = await Promise.all(
            items.map(async (post) => {
                try {
                    const { url } = await getUrl({ path: post.imageKey });
                    return { ...post, imageUrl: url.toString() }; // Convert URL to string
                } catch (error) {
                    console.error(`Error fetching image for ${post.id}:`, error);
                    return { ...post, imageUrl: undefined }; // Use undefined instead of null
                }
            })
        );

        setPostsDb(updatedPosts);
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    console.log(postsDb);

    const handleVote = async (postId: string, votes?: number | undefined) => {
        try {
            const updatedPosts = await client.models.Post.update({
                id: postId,
                votes: votes ? votes + 1 : 1,
            });
            setPosts(prevPosts => prevPosts.map(post =>
                post.id === postId ? { ...post, votes: votes ? votes + 1 : 1 } : post
            ));
        } catch (error) {
            console.error("Error updating vote:", error);
        }
    };

    return (
        <SafeAreaView style={[styles.container, isDesktop && styles.desktopCardWrapper]}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={[styles.challengeCardWrapper]}>
                    <ChallengeCard challenge={todaysChallenge} />
                </View>
                {postsDb.map(post => (
                    <Post
                        key={post.id}
                        post={post}
                        onUpvote={() => handleVote(post.id, post.votes)} // Only handle the upvote
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



const stylesPost = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        marginBottom: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    authorName: {
        marginLeft: 12,
        fontWeight: '600',
    },
    postImage: {
        width: 'auto',
        height: 'auto',
        aspectRatio: 1,
    },
    captionWrapper: {
        padding: 16,
    },
    voteWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    heartButton: {
        marginRight: 8,
    },
    voteCount: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 8,
    },
    caption: {
        color: '#333',
    },
});

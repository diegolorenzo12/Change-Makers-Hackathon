import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ImageSourcePropType, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importing FontAwesome for the heart icon
import { generateClient } from 'aws-amplify/api';
import type { Schema } from '@/amplify/data/resource';

interface PostProps {
    post: (Schema["Post"]["type"] & { imageUrl?: string })
    onUpvote: () => void;  // This can be removed if you're no longer handling votes
    // onDownvote: () => void;  // You can remove this if it's no longer needed
}


export default function Post({ post, onUpvote }: PostProps) {
    const [isLiked, setIsLiked] = useState(false);  // Track if the post is liked

    const handleLike = () => {
        setIsLiked(prevLiked => !prevLiked);  // Toggle the liked state
        onUpvote();  // Assuming onUpvote handles the voting logic elsewhere
    };

    return (
        <View style={styles.container}>
            {/* Author header */}
            <View style={styles.header}>
                {
                    post.author && post.author.avatar ?
                        (<Image
                            source={{ uri: post.author.avatar }}
                            style={styles.avatar}
                        />) :
                        (
                            <></>
                        )
                }
                <Text style={styles.authorName}>{post.author?.name}</Text>
            </View>

            {/* Post image */}
            {post.imageUrl ? (
                <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
            ) : (
                <Text>Image not available</Text>
            )}

            {/* Voting and caption */}
            <View style={styles.captionWrapper}>
                <View style={styles.voteWrapper}>
                    {/* Heart Icon for voting */}
                    <TouchableOpacity style={styles.heartButton} onPress={handleLike}>
                        <Icon
                            name="heart"
                            size={30}
                            color={isLiked ? 'green' : '#ccc'}
                        />
                    </TouchableOpacity>

                    {/* Vote count */}
                    <Text style={styles.voteCount}>{post.votes}</Text>
                </View>

                <Text style={styles.caption}>{post.title}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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

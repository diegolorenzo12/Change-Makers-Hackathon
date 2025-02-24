import React, { useEffect } from 'react';
import { View, Text } from 'react-native';

import { generateClient } from "aws-amplify/api";
import type { Schema } from '@/amplify/data/resource';
import { createAIHooks } from "@aws-amplify/ui-react-ai";

export const client = generateClient<Schema>();
export const { useAIGeneration } = createAIHooks(client);

interface ChallengeCardProps {
    challenge: {
        title: string;
        description: string;
        deadline: string;
        category: string;
        impact: string;
    };
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {

    const [{ data, isLoading, hasError }, generateTask] =
        useAIGeneration("generateTask");

    const handleGenerateTask = () => {
        generateTask({});
    };

    useEffect(() => {
        generateTask({});
    }, [generateTask]);

    if (!data) {
        return (
            <View className="bg-green-50 p-4 rounded-lg mb-4 border border-green-100">
                <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                        <Text className="text-lg font-bold text-green-800">{challenge.title}</Text>
                        <Text className="text-green-600 text-sm mb-2">{challenge.category}</Text>
                    </View>
                    <View className="bg-green-100 px-3 py-1 rounded-full">
                        <Text className="text-green-700 text-sm">Today's Challenge</Text>
                    </View>
                </View>
                <Text className="text-gray-600 mb-3">{challenge.description}</Text>
                <View className="flex-row justify-between items-center">
                    <Text className="text-green-700">🌱 Impact: {challenge.impact}</Text>
                    <Text className="text-gray-500">Ends in: {challenge.deadline}</Text>
                </View>
            </View>
        );
    }

    return (
        <View className="bg-green-50 p-4 rounded-lg mb-4 border border-green-100">
            <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                    <Text className="text-lg font-bold text-green-800">{data.title}</Text>
                    <Text className="text-green-600 text-sm mb-2">{data.helps}</Text>
                </View>
                <View className="bg-green-100 px-3 py-1 rounded-full">
                    <Text className="text-green-700 text-sm">Today's Challenge</Text>
                </View>
            </View>
            <Text className="text-gray-600 mb-3">{data.description}</Text>
            <View className="flex-row justify-between items-center">
                <Text className="text-green-700">🌱 Impact: {data.impact}</Text>
                <Text className="text-gray-500">Ends in: {challenge.deadline}</Text>
            </View>
        </View>
    );
}
import type { Handler } from 'aws-lambda';
import { generateClient } from 'aws-amplify/data';
import { uploadData } from 'aws-amplify/storage';
import { Schema } from '../../data/resource';
import { v4 as uuid } from 'uuid';

const client = generateClient<Schema>();


export const handler: Handler = async (event, context) => {
    const { title, imageBase64 } = JSON.parse(event.body);

    // Generate a unique key for the image
    const imageKey = `images/${uuid()}.jpg`;

    try {
        // Upload image to S3 using Amplify Storage (new API)
        const uploadResult = await uploadData({
            key: imageKey,
            data: Buffer.from(imageBase64, 'base64'),
            options: {
                contentType: 'image/jpeg',
            },
        }).result;

        const postId = uuid();
        const createdAt = new Date().toISOString();
        const newPost = await client.models.Post.create({
            id: postId,
            title,
            imageKey,
            createdAt,
        });


        return {
            statusCode: 200,
            body: JSON.stringify(newPost),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};
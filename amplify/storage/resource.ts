import { defineStorage } from '@aws-amplify/backend';
import { createPost } from '../functions/create-post/resource';


export const storage = defineStorage({
    name: 'postsDrive',
    access: (allow) => ({
        'images/*': [
            allow.authenticated.to(['read', 'write']),
            allow.guest.to(['read', 'write']),
            allow.resource(createPost).to(['read', 'write', 'delete'])
        ],
    })
});
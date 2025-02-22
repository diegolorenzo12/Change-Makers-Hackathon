import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
    name: 'postsDrive',
    access: (allow) => ({
        // Allow public read/write to everything in the 'public/*' path
        'images/*': [
            allow.guest.to(['read', 'write']) // Public access
        ]
    }),
});
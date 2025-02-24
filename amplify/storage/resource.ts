import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
    name: 'postsDrive',
    access: (allow) => ({
        'images/*': [
            allow.authenticated.to(['read', 'write']),
            allow.guest.to(['read', 'write', 'delete']),
        ],
    })
});


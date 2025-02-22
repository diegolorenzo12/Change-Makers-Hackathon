import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Post: a
    .model({
      id: a.id().required(),
      name: a.string().required(),
    })
    .identifier(['id']),

})
  .authorization(allow => [allow.publicApiKey()])

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',  // Use Cognito User Pools for authentication
    apiKeyAuthorizationMode: { expiresInDays: 30 }
  },
});

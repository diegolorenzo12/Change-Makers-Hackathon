import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { createPost } from "../functions/create-post/resource"; // Adjust the function import path

const schema = a.schema({
  Post: a.model({
    id: a.id().required(),
    title: a.string().required(),
    imageKey: a.string().required(),
    createdAt: a.datetime().required(),
  }),

  createPostWithImage: a
    .mutation()
    .arguments({
      title: a.string().required(),
      imageBase64: a.string().required()
    })
    .returns(a.ref('Post'))
    .handler(a.handler.function(createPost)),
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

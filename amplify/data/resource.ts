import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Post: a.model({
    id: a.id().required(),
    title: a.string().required(),
    imageKey: a.string().required(),
    createdAt: a.datetime().required(),
    author: a.customType({
      name: a.string(),
      avatar: a.string()
    }),
    votes: a.integer().default(0)
  }),

  generateTask: a.generation({
    aiModel: a.ai.model('Claude 3 Haiku'),
    systemPrompt: 'You are an AI assistant that generates environmental tasks. Each task should be simple, actionable, and impactful.',
  })
    .arguments({})
    .returns(
      a.customType({
        title: a.string(),
        helps: a.string(),
        description: a.string(),
        impact: a.string(),
      })
    )
})
  .authorization(allow => [allow.publicApiKey(), allow.guest()])

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',  // Use Cognito User Pools for authentication
    apiKeyAuthorizationMode: { expiresInDays: 30 }
  },
});

// apollo.config.ts
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client/core';

export const apolloClient = new ApolloClient({
  link: createHttpLink({
    uri: 'https://styleflip.v2.ithemes.xyz/graphql',
  }),
  cache: new InMemoryCache(),
});

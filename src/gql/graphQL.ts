import { ApolloClient } from 'apollo-client'
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'

export default class GraphQL {
  private gqlClient: ApolloClient<NormalizedCacheObject>
  private cache: InMemoryCache

  public constructor () {
    this.cache = new InMemoryCache()

    this.gqlClient = new ApolloClient({
      link: ApolloLink.from([
        onError(({ graphQLErrors, networkError }) => {
          if (graphQLErrors)
            graphQLErrors.forEach(({ message, locations, path }) =>
              console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
              ),
            )
          if (networkError) console.log(`[Network error]: ${networkError}`)
        }),
        new HttpLink({
          uri: process.env.GRAPHQL_ENDPOINT,
          credentials: 'same-origin'
        })
      ]),
      cache: this.cache,
      connectToDevTools: true
    })
  }

  public getClient (): ApolloClient<NormalizedCacheObject> {
    return this.gqlClient
  }
}
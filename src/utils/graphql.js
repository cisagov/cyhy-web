import { ApolloClient } from "apollo-client";
import { from } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import { InMemoryCache } from "apollo-cache-inmemory";
import store from "../store/";

// the link to the backend graphql API server
const httpLink = new HttpLink({ uri: "http://localhost:5000/graphql" });

// a link to inject the accessToken into the authentication headers when possible
const authLink = setContext((_, { headers }) => {
  const token = store.state.auth.accessToken;
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

// this link will handle errors and log the user out if required
const logoutLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.map(({ message, locations, path }) => {
      // eslint-disable-next-line no-console
      console.warn(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      // our token probably expired, time to logout
      // TODO try to refresh first
      store.dispatch("auth/logout");
    });
  if (networkError) {
    // eslint-disable-next-line no-console
    console.error(`[Network error]: ${networkError}`);
    if (networkError.statusCode === 401) store.dispatch("auth/logout");
  }
});

// disable the cache, we are using Vuex as our data store
// https://www.apollographql.com/docs/react/advanced/caching.html#ignore
const defaultOptions = {
  watchQuery: {
    fetchPolicy: "network-only",
    errorPolicy: "ignore"
  },
  query: {
    fetchPolicy: "network-only",
    errorPolicy: "all"
  }
};

export default new ApolloClient({
  // chain links together
  link: from([authLink, logoutLink, httpLink]),
  // Using a cache for blazingly fast subsequent queries.
  cache: new InMemoryCache(),
  defaultOptions
});

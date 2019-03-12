import { ApolloClient } from "apollo-client";
import { from } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { onError } from "apollo-link-error";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import { InMemoryCache } from "apollo-cache-inmemory";
import jwtDecode from "jwt-decode";
import store from "../store/";

function shouldRefreshAccessToken() {
  // determine if the access token should be refreshed
  if (store.state.auth.accessToken == null) return false; // no token to refresh (guest)
  const jwt = jwtDecode(store.state.auth.accessToken);
  const local_time = Date.now() / 1000;
  // calculate what the server time is using the previously measured skew
  const server_time = local_time + store.state.auth.clockSkew;
  // check if the token is within a valid time window
  return server_time < jwt.nbf || server_time > jwt.exp;
}

// the link to the backend graphql API server
const httpLink = new HttpLink({ uri: "http://localhost:5000/graphql" });

// a link to inject the accessToken into the authentication headers when possible
const authLink = setContext((_, { headers }) => {
  const token = store.state.auth.accessToken;
  console.debug(">>> should refresh >>> ", shouldRefreshAccessToken());
  // return the headers to the context so httpLink can read them
  if (token) {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`
      }
    };
  } else {
    // the accessToken is not available, no authentication header
    return;
  }
});

// const refreshLink = new TokenRefreshLink({
//   accessTokenField: 'accessToken',
//   isTokenValidOrUndefined: () => { return !shouldRefreshAccessToken();},
//   fetchAccessToken: () => Promise<Response>,
//   handleFetch: (accessToken: string) => void,
//   handleResponse?: (operation, accessTokenField) => response => any,
//   handleError?: (err: Error) => void,
// });

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
      // store.dispatch("auth/refresh");
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
    fetchPolicy: "no-cache",
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

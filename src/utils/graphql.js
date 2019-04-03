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

  // If the client doesn't have an access token stored, then we are dealing with a
  // guest.  We can't refresh what we don't have so return false.
  if (store.state.auth.accessToken == null) return false;

  // Since we have an access token, check to see if it is still valid using the client's
  // concept of the current time and the skew that we recorded when last a token was
  // issued.  This doesn't have to be perfect, but if it is close, it will save a
  // round-trip to the server.
  const jwt = jwtDecode(store.state.auth.accessToken);
  const local_time = Date.now() / 1000;
  // calculate what the server time is using the previously measured skew
  const server_time = local_time + store.state.auth.clockSkew;
  // check if the token is within a valid time window
  return server_time < jwt.nbf || server_time > jwt.exp;
}

// the link to the backend graphql API server
// TODO: this should be configurable
const httpLink = new HttpLink({ uri: "http://localhost:5000/graphql" });

// a link to inject the accessToken into the authentication headers when possible
const authLink = setContext((request, previousContext) => {
  var token;
  // when we are refreshing an accessToken we need to send the refreshToken
  if (previousContext.useRefreshToken) {
    token = store.state.auth.refreshToken;
  } else {
    token = store.state.auth.accessToken;
  }

  if (token) {
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...previousContext.headers,
        authorization: `Bearer ${token}`
      }
    };
  } else {
    // the accessToken is not available, no authorization header added
    return;
  }
});

// See: https://github.com/newsiberian/apollo-link-token-refresh
const refreshLink = new TokenRefreshLink({
  // This is a name of access token field in response. In some scenarios we want to
  // pass additional payload with access token, i.e. new refresh token, so this field
  // could be the object's name
  accessTokenField: "accessToken",

  // Indicates the current state of access token expiration.
  // If token not yet expired or user doesn't have a token (guest) true should
  // be returned.
  isTokenValidOrUndefined: () => {
    return !shouldRefreshAccessToken();
  },

  // Function covers fetch call with request fresh access token
  fetchAccessToken: () => {
    // eslint-disable-next-line no-unused-vars
    return new Promise(function(resolve, reject) {
      // clear the current accessToken so that shouldRefresh doesn't recursively trigger
      store.commit("auth/clearAccessToken");
      // refresh the accessToken
      const response = store.dispatch("auth/refresh");
      // since we're using apollo-link-token-refresh we need to finish implementing
      // the process that it requires.  At this point the access token has been returned
      // and saved in the store.
      resolve(response);
    });
  },

  // Callback which receives a fresh token from Response.
  // From here we can save token to the storage
  // eslint-disable-next-line no-unused-vars
  handleFetch: accessToken => {
    // The token was already saved.  This is just a required noop
  },

  // This is optional. It could be used to override internal function to manually parse
  // and extract your token from server response
  handleResponse: (operation, accessTokenField) => response => {
    // the default extract implementation of apollo-link-token-refresh doesn't handle
    // our graphql response.  So we need to extract the token, and return it in the
    // format it expects.
    const token = response.data.refresh.result.accessToken;
    // make the return value match the expectations of apollo-link-token-refresh
    return { [accessTokenField]: token };
  },

  // Token fetch error callback. Allows to run additional actions like logout.
  // Don't forget to handle Error if you are using this option
  handleError: err => {
    // eslint-disable-next-line no-console
    console.warn("Your refresh token is invalid. Try to relogin");
    // eslint-disable-next-line no-console
    console.error(err);
  }
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
  link: from([refreshLink, authLink, logoutLink, httpLink]),
  // Using a cache for blazingly fast subsequent queries.
  cache: new InMemoryCache(),
  defaultOptions
});

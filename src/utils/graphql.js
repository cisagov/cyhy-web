import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { InMemoryCache } from "apollo-cache-inmemory";
// import { mapGetters } from "vuex";
// import { store } from "@/store";

// mapGetters(["accessToken"]);

const httpLink = new HttpLink({ uri: "http://localhost:5000/graphql" });

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

export default new ApolloClient({
  // Provide the URL to the API server.
  link: authLink.concat(httpLink),
  // Using a cache for blazingly
  // fast subsequent queries.
  cache: new InMemoryCache()
});

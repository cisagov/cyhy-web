// define the actions of this Vuex store module

import graphqlClient from "@/utils/graphql";
import gql from "graphql-tag";

export default {
  async auth(
    // eslint-disable-next-line
    { dispatch, commit, getters, rootGetters },
    { email, password }
  ) {
    const response = await graphqlClient.mutate({
      // It is important to not use the ES6 template syntax for variables
      // directly inside the `gql` query, because this would make it impossible
      // for Babel to optimize the code.
      mutation: gql`
        mutation($email: String!, $password: String!) {
          auth(email: $email, password: $password) {
            result {
              __typename
              ... on AuthField {
                accessToken
                refreshToken
                uid
                message
              }
              ... on ResponseMessageField {
                message
                isSuccess
              }
            }
          }
        }
      `,
      variables: {
        email: email,
        password: password
      }
    });
    // Trigger the `setTokens` mutation.
    // TODO handle failure
    commit("setTokens", {
      accessToken: response.data.auth.result.accessToken,
      refreshToken: response.data.auth.result.refreshToken,
      viewer: response.data.auth.result.uid
    });
  },
  async logout({ commit }) {
    commit("logout");
  },
  async viewer(
    // eslint-disable-next-line
    { dispatch, commit, getters, rootGetters }
  ) {
    const response = await graphqlClient.query({
      query: gql`
        query {
          viewer {
            email
          }
        }
      `
    });
    // eslint-disable-next-line no-console
    console.log(response.data);
  },
  async refresh({ commit }) {
    const response = await graphqlClient.mutate({
      mutation: gql`
        mutation {
          refresh {
            result {
              accessToken
              message
            }
          }
        }
      `,
      // tell the graphql client to use the refreshToken in the Authentication header
      context: { useRefreshToken: true }
    });
    commit("refresh", {
      accessToken: response.data.refresh.result.accessToken
    });
    return response; // Returning the response for the apollo-link to use
  }
};

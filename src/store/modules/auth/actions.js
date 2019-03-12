// define the actions of this Vuex store module

import graphqlClient from "@/utils/graphql";
import gql from "graphql-tag";

export default {
  async auth(
    // eslint-disable-next-line
    { dispatch, commit, getters, rootGetters },
    { username, password }
  ) {
    const response = await graphqlClient.mutate({
      // It is important to not use the ES6 template syntax for variables
      // directly inside the `gql` query, because this would make it impossible
      // for Babel to optimize the code.
      mutation: gql`
        mutation($username: String!, $password: String!) {
          auth(username: $username, password: $password) {
            result {
              __typename
              ... on AuthField {
                accessToken
                refreshToken
                username
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
        username: username,
        password: password
      }
    });
    // Trigger the `setTokens` mutation which is defined above.
    // TODO handle failure
    commit("setTokens", {
      accessToken: response.data.auth.result.accessToken,
      refreshToken: response.data.auth.result.refreshToken,
      viewer: response.data.auth.result.username
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
            username
          }
        }
      `
    });
    // eslint-disable-next-line no-console
    console.log(response.data);
  }
};

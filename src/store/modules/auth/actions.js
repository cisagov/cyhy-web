// define the actions of this Vuex store module

import graphqlClient from "@/utils/graphql";
import gql from "graphql-tag";

export default {
  async auth(
    // eslint-disable-next-line
    { dispatch, commit, getters, rootGetters },
    { email, password }
  ) {
    commit("loginStart");
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
    if (response.data.auth.result.isSuccess == false) {
      // failure
      commit("loginFailure", {
        message: response.data.auth.result.message
      });
    } else {
      // success
      commit("loginSuccess", {
        // Trigger the `login` mutation.
        accessToken: response.data.auth.result.accessToken,
        refreshToken: response.data.auth.result.refreshToken,
        viewer: response.data.auth.result.uid
      });
    }
  },
  async logout(
    // eslint-disable-next-line
    { dispatch, commit, getters, rootGetters }
  ) {
    const response = await graphqlClient.mutate({
      mutation: gql`
        mutation {
          logout {
            result {
              message
              isSuccess
            }
          }
        }
      `,
      // tell the graphql client to use the refreshToken in the Authentication header
      context: { useRefreshToken: true }
    });
    if (response.data.logout.result.isSuccess == false) {
      // failure
      // eslint-disable-next-line no-console
      console.error(response.data.logout.result.message);
    }
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
              __typename
              ... on RefreshField {
                uid
                accessToken
              }
              ... on ResponseMessageField {
                isSuccess
                message
              }
            }
          }
        }
      `,
      // tell the graphql client to use the refreshToken in the Authentication header
      context: { useRefreshToken: true }
    });
    if (response.data.refresh.result.isSuccess == false) {
      // failure
      // the refresh token may have been revoked or expired
      // eslint-disable-next-line no-console
      console.error(response.data.refresh.result.message);
      commit("logout");
    } else {
      // success
      commit("refresh", {
        accessToken: response.data.refresh.result.accessToken,
        viewer: response.data.refresh.result.uid
      });
    }
    return response; // Returning the response for the apollo-link to use
  }
};

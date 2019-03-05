import Vue from "vue";
import Vuex from "vuex";
import gql from "graphql-tag";

import graphqlClient from "@/utils/graphql";

Vue.use(Vuex);

export const mutations = {
  setTokens(state, { accessToken, refreshToken, viewer }) {
    state.accessToken = accessToken;
    state.refreshToken = refreshToken;
    state.viewer = viewer;
  },
  setViewer(state, username) {
    state.viewer = username;
  }
};

export const actions = {
  async auth({ commit }, { username, password }) {
    const response = await graphqlClient.mutate({
      // It is important to not use the
      // ES6 template syntax for variables
      // directly inside the `gql` query,
      // because this would make it impossible
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
    // Trigger the `setTokens` mutation
    // which is defined above.
    // TODO handle failure
    commit("setTokens", {
      accessToken: response.data.auth.result.accessToken,
      refreshToken: response.data.auth.result.refreshToken,
      viewer: response.data.auth.result.username
    });
  }
};

export const state = {
  viewer: null,
  accessToken: null,
  refreshToken: null
};

export default new Vuex.Store({
  mutations,
  actions,
  state
});

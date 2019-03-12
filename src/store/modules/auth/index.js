// assemble this Vuex store module from the separate files

import mutations from "./mutations";
import getters from "./getters";
import actions from "./actions";

const state = {
  viewer: null,
  clockSkew: 0,
  accessToken: null,
  // load the refreshToken from storage if possible
  refreshToken: localStorage.getItem("refreshToken") || null
};

export default {
  namespaced: true,
  mutations,
  actions,
  state,
  getters
};

import mutations from "./mutations";
import getters from "./getters";
import actions from "./actions";

const state = {
  viewer: null,
  accessToken: null,
  refreshToken: localStorage.getItem("refreshToken") || null
};

export default {
  namespaced: true,
  mutations,
  actions,
  state,
  getters
};

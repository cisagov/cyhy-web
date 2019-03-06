import Vue from "vue";
import Vuex from "vuex";

import auth from "./modules/auth";

Vue.use(Vuex);

const modules = { auth: auth };

export default new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== "production" // expensive
});

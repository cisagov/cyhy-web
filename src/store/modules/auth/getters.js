// define the getters of this Vuex store module

export default {
  // determine if there is a user logged in
  isLoggedIn: state => !!state.accessToken
};

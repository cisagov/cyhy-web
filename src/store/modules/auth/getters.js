// define the getters of this Vuex store module
import jwtDecode from "jwt-decode";

export default {
  // determine if there is a user logged in
  isLoggedIn: state => !!state.accessToken,
  // determine if the accessToken is fresh.  That is it was not produced from a renwal
  // via a refreshToken.
  isFresh: state => {
    if (!state.accessToken) {
      return false;
    }
    const jwt = jwtDecode(state.accessToken);
    return jwt.fresh == true;
  }
};

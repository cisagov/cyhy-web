// define the getters of this Vuex store module
import jwtDecode from "jwt-decode";

export default {
  // determine if there is a user logged in
  isLoggedIn: state => !!state.accessToken,

  // determine if the accessToken should be renewed
  shouldRefreshAccessToken: state => {
    if (!state.accessToken) return false; // no token to refresh (guest)
    const jwt = jwtDecode(state.accessToken);
    const local_time = Date.now() / 1000;
    // calculate what the server time is using the previously measured skew
    const server_time = local_time + state.clockSkew;
    // check if the token is within a valid time window
    return server_time < jwt.nbf || server_time > jwt.exp;
  }
};

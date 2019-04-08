// define the mutations of this Vuex store module
import jwtDecode from "jwt-decode";

function calculateSkew(token) {
  // calculate the local clock skew from the server
  // this is needed so the client can accurately anticipate token expiration
  // this assumes that the server has issued the token very recently
  const jwt = jwtDecode(token);
  const local_time = Date.now() / 1000;
  return jwt.iat - local_time;
}

export default {
  login(state, { accessToken, refreshToken, viewer }) {
    state.accessToken = accessToken;
    state.refreshToken = refreshToken;
    state.viewer = viewer;
    state.clockSkew = calculateSkew(accessToken);
    // refresh tokens persist unlike access tokens
    localStorage.setItem("refreshToken", refreshToken);
  },
  setViewer(state, username) {
    state.viewer = username;
  },
  logout(state) {
    state.accessToken = null;
    state.refreshToken = null;
    state.viewer = null;
    // when a user logs out, we need to remove the refresh token so they cannot
    // refresh and access token in the future without first re-authenticating
    localStorage.removeItem("refreshToken");
  },
  clearAccessToken(state) {
    state.accessToken = null;
  },
  refresh(state, { accessToken }) {
    state.accessToken = accessToken;
  }
};

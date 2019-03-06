export default {
  setTokens(state, { accessToken, refreshToken, viewer }) {
    state.accessToken = accessToken;
    state.refreshToken = refreshToken;
    state.viewer = viewer;
    localStorage.setItem("refreshToken", refreshToken); // persist
  },
  setViewer(state, username) {
    state.viewer = username;
  },
  logout(state) {
    state.accessToken = null;
    state.refreshToken = null;
    state.viewer = null;
    localStorage.removeItem("refreshToken"); // unpersist
  }
};

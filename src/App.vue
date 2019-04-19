<template>
  <div id="app">
    <div class="ui inverted main menu">
      <div class="header item">
        <img class="logo" src="ch.svg" />
        Cyber Hygiene
      </div>
      <router-link to="/diag" class="item">Diagnostics</router-link> |
      <router-link to="/about" v-if="isLoggedIn" class="item"
        >About</router-link
      >
      <router-link to="/secure" v-if="isLoggedIn" class="item"
        >Secure</router-link
      >
      <a @click="viewer" class="item">Viewer</a>
      <router-link v-if="!isLoggedIn" to="/login" class="item right floated"
        >Sign In</router-link
      >
      <router-link v-if="!isLoggedIn" to="/join" class="item"
        >Sign Up</router-link
      >
      <a v-if="isLoggedIn" class="item right floated" @click="logout"
        >Sign Out</a
      >
    </div>
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters("auth", ["isLoggedIn"])
  },
  methods: {
    logout: function() {
      this.$store.dispatch("auth/logout").then(() => {
        this.$router.push("/login");
      });
    },
    viewer: function() {
      this.$store.dispatch("auth/viewer");
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.main.menu .item img.logo {
  padding-right: 1em;
}
</style>

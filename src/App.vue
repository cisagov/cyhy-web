<template>
  <div id="app">
    <div class="ui inverted menu main">
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
      <a v-if="isLoggedIn" class="item right floated" @click="logout">Logout</a>
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
/*
.main.container {
  margin-top: 2em;
}
.main.menu {
  margin-top: 4em;
  border-radius: 0;
  border: none;
  box-shadow: none;
  transition: box-shadow 0.5s ease, padding 0.5s ease;
}*/
.main.menu .item img.logo {
  padding-right: 1em;
}
/*.overlay {
  float: left;
  margin: 0em 3em 1em 0em;
}
.overlay .menu {
  position: relative;
  left: 0;
  transition: left 0.5s ease;
}
.main.menu.fixed {
  background-color: #ffffff;
  border: 1px solid #ddd;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.2);
}
.overlay.fixed .menu {
  left: 800px;
}
.text.container .left.floated.image {
  margin: 2em 2em 2em -4em;
}
.text.container .right.floated.image {
  margin: 2em -4em 2em 2em;
}
.ui.footer.segment {
  margin: 5em 0em 0em;
  padding: 5em 0em;
} */
</style>

<template>
  <div class="login">
    <h1>This is the login page</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" v-model="username" name="username" />
      </div>
      <div class="form-group">
        <label htmlFor="password">Password</label>
        <input type="password" v-model="password" name="password" />
      </div>
      <div class="form-group">
        <button>Login</button>
      </div>
    </form>
    <p>
      accessToken:
      <a
        :href="'https://jwt.io/#debugger-io?token=' + accessToken"
        target="_blank"
      >
        <code>{{ accessToken }}</code></a
      >
    </p>
    <p>
      refreshToken:
      <a
        :href="'https://jwt.io/#debugger-io?token=' + refreshToken"
        target="_blank"
      >
        <code>{{ refreshToken }}</code></a
      >
    </p>
    <p>
      username: <code>{{ viewer }}</code>
    </p>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Login",
  data: function() {
    return { username: "", password: "" };
  },
  computed: {
    ...mapState("auth", ["accessToken", "refreshToken", "viewer"])
  },
  methods: {
    handleSubmit() {
      this.submitted = true;
      const { username, password } = this;
      const { dispatch } = this.$store;
      if (username && password) {
        dispatch("auth/auth", {
          username,
          password
        });
      }
    }
  }
};
</script>

<style scoped>
code {
  display: inline-block;
  padding: 10px;
  border: solid;
  width: 50%;
  overflow-wrap: break-word;
}
</style>

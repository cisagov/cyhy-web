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
      accessToken: <code>{{ accessToken }}</code>
    </p>
    <p>
      refreshToken: <code>{{ refreshToken }}</code>
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
  computed: {
    ...mapState(["accessToken", "refreshToken", "viewer"])
  },
  methods: {
    handleSubmit(e) {
      this.submitted = true;
      const { username, password } = this;
      const { dispatch } = this.$store;
      if (username && password) {
        dispatch("auth", {
          username,
          password
        });
      }
    }
  }
};
</script>

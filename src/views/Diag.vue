<template>
  <div class="diagnostics">
    <h1>App Diagnostics</h1>
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

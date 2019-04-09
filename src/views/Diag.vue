<template>
  <div class="diagnostics">
    <h1 class="ui header">App Diagnostics</h1>
    <div class="ui raised very padded text container segment">
      <div class="ui top left attached label">
        Refresh Token<a
          class="detail"
          :href="'https://jwt.io/#debugger-io?token=' + refreshToken"
          target="_blank"
          ><i class="external alternate icon"></i
        ></a>
      </div>
      <p>
        <code>{{ refreshToken }}</code>
      </p>
    </div>
    <div class="ui raised very padded text container segment">
      <div class="ui top left attached label">
        Access Token<a
          class="detail"
          :href="'https://jwt.io/#debugger-io?token=' + accessToken"
          target="_blank"
          ><i class="external alternate icon"></i
        ></a>
      </div>
      <p>
        <code>{{ accessToken }}</code>
      </p>
    </div>
    <div class="ui raised very padded text container segment">
      <div class="ui top left attached label">User ID</div>
      <p>
        <code>{{ viewer }}</code>
      </p>
    </div>
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
  /* display: inline-block;
  padding: 10px;
  border: solid;
  width: 50%; */
  overflow-wrap: break-word;
}
</style>

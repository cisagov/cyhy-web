<template lang="html">
  <div class="background">
    <sui-grid centered vertical-align="middle">
      <sui-grid-column>
        <h2 is="sui-header" color="violet" image>
          <sui-image src="static/images/logo.png" />
          <sui-header-content>Log-in to your account</sui-header-content>
        </h2>

        <sui-form @submit.prevent="handleSubmit">
          <sui-segment stacked>
            <sui-form-field>
              <sui-input
                type="text"
                placeholder="Username"
                icon="user"
                icon-position="left"
                v-model="username"
              />
            </sui-form-field>
            <sui-form-field>
              <sui-input
                type="password"
                placeholder="Password"
                icon="lock"
                icon-position="left"
                v-model="password"
              />
            </sui-form-field>
            <sui-button size="large" color="violet" fluid>Login</sui-button>
          </sui-segment>
        </sui-form>

        <sui-message>New to us? <a href="#">Sign Up</a></sui-message>
      </sui-grid-column>
    </sui-grid>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Login",
  data: function() {
    return { username: "", password: "" };
  },
  computed: {},
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

<style lang="css" scoped>
.background {
  background-color: #DADADA !important;
  height: 100vh;
  margin: 1em 0;
}

.grid {
  height: 100%;
}

.column {
  max-width: 450px;
  text-align: center !important;
}
</style>

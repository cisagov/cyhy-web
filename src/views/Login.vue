<template lang="html">
  <div class="background">
    <sui-grid centered vertical-align="middle">
      <sui-grid-column>
        <sui-image src="ch.svg" centered />
        <h2 is="sui-header" color="violet" image>
          <sui-header-content>Log-in to your account</sui-header-content>
        </h2>

        <sui-form @submit.prevent="handleSubmit">
          <sui-segment stacked>
            <sui-form-field>
              <sui-input
                type="email"
                placeholder="E-mail address"
                icon="user"
                icon-position="left"
                v-model="email"
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
    return { email: "", password: "" };
  },
  computed: {},
  methods: {
    handleSubmit() {
      this.submitted = true;
      const { email, password } = this;
      const { dispatch } = this.$store;
      if (email && password) {
        dispatch("auth/auth", {
          email,
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

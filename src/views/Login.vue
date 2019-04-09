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
            <sui-button
              size="large"
              color="violet"
              fluid
              :loading="submitted"
              :disabled="submitted"
              >Login</sui-button
            >
          </sui-segment>
        </sui-form>
        <div v-if="errorMessage" class="ui negative message">
          <div class="header">
            {{ errorMessage }}
          </div>
          <p>Please verify your e-mail and password are correct.</p>
        </div>
        <sui-message>New to CyHy? <a href="#">Sign Up</a></sui-message>
      </sui-grid-column>
    </sui-grid>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

function doSucessfulLogin(caller_this) {
  if (caller_this.$route.query.redirect) {
    // a redirect was passed via a query parameter
    caller_this.$router.push(caller_this.$route.query.redirect);
  } else {
    // no redirect present, send them to the default starting page
    // TODO set an alias to the default route
    caller_this.$router.push({ name: "diagnostics" });
  }
}

export default {
  name: "Login",
  data: function() {
    return { email: "", password: "", submitted: false };
  },
  computed: {
    ...mapState("auth", ["errorMessage"]),
    ...mapGetters("auth", ["isLoggedIn", "isFresh"])
  },
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
  },
  watch: {
    // eslint-disable-next-line
    errorMessage(newValue, oldValue) {
      if (newValue != null) {
        // if the error message is set, clear submitted flag so the user can try again.
        this.submitted = false;
      }
    },
    // eslint-disable-next-line
    isLoggedIn(newValue, oldValue) {
      // send the user on their way once they are logged in
      if (newValue == true) {
        doSucessfulLogin(this);
      }
    },
    isFresh(newValue, oldValue) {
      //a freshness change has the same effect as a login
      if (newValue == true) {
        doSucessfulLogin(this);
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

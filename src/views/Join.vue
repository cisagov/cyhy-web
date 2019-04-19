<template lang="html">
  <div class="background">
    <sui-grid centered vertical-align="top">
      <sui-grid-column>
        <h2 is="sui-header" color="violet" image>
          <sui-header-content>Create your CyHy account</sui-header-content>
        </h2>

        <sui-form @submit.prevent="handleSubmit" :error="!!errorMessage">
          <sui-segment stacked>
            <sui-form-field>
              <label>Name</label>
              <div class="two fields">
                <div class="field">
                  <sui-input
                    type="text"
                    placeholder="First Name"
                    v-model="email"
                  />
                </div>
                <div class="field">
                  <sui-input
                    type="text"
                    placeholder="Last Name"
                    v-model="email"
                  />
                </div>
              </div>
            </sui-form-field>
            <sui-form-field>
              <label>E-mail address</label>
              <sui-input
                type="email"
                placeholder="E-mail address"
                icon="mail"
                icon-position="left"
                v-model="email"
              />
            </sui-form-field>
            <sui-form-field>
              <label>Password</label>
              <sui-input
                type="password"
                placeholder="Password"
                icon="lock"
                icon-position="left"
                v-model="password"
              />
            </sui-form-field>
            <div class="field">
              <div class="ui checkbox">
                <input type="checkbox" tabindex="0" class="hidden" />
                <label>I agree to the Terms and Conditions</label>
              </div>
            </div>
            <sui-button
              size="large"
              color="green"
              fluid
              :loading="submitted"
              :disabled="submitted"
              >Create an account</sui-button
            >
          </sui-segment>
          <div class="ui error message">
            <div class="header">
              {{ errorMessage }}
            </div>
            <p>Please verify your e-mail and password are correct.</p>
          </div>
        </sui-form>
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
    // eslint-disable-next-line
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
  /* background-color: #DADADA !important; */
  height: 100vh;
  margin: 1em 0;
}

.grid {
  height: 100%;
}

.column {
  max-width: 800px;
  text-align: left !important;
}
</style>

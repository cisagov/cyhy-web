<template>
  <div class="login">
    <h1>This is the login page</h1>
    <p>accessToken: <code>{{accessToken}}</code></p>
    <p>refreshToken: <code>{{refreshToken}}</code></p>
    <p>username: <code>{{viewer}}</code></p>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Login',
  computed: {
    ...mapState(['accessToken', 'refreshToken', 'viewer']),
  },
  beforeCreate() {
    // TODO get from a form
    this.$store.dispatch('auth', {username: 'felddy', password:'foobar'});
  },
};
</script>

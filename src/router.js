import Vue from "vue";
import Router from "vue-router";
import store from "./store";

Vue.use(Router);

// route level code-splitting
// this generates a separate chunk (component.[hash].js) for each route
// which is lazy-loaded when the route is visited.

const router = new Router({
  // https://router.vuejs.org/guide/essentials/history-mode.html
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: () =>
        import(/* webpackChunkName: "home" */ "./views/Home.vue"),
      meta: {
        requiresAuth: false
      }
    },
    {
      path: "/about",
      name: "about",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue"),
      props: { message: "Freshness not guaranteed." },
      meta: {
        requiresAuth: true
      }
    },
    {
      path: "/login",
      name: "login",
      component: () =>
        import(/* webpackChunkName: "login" */ "./views/Login.vue")
    },
    {
      path: "/join",
      name: "join",
      component: () =>
        import(/* webpackChunkName: "login" */ "./views/Join.vue")
    },
    {
      path: "/secure",
      name: "secure",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue"),
      props: { message: "Freshness GUARANTEED!" },
      meta: {
        requiresFreshAuth: true
      }
    },
    {
      path: "/diag",
      name: "diagnostics",
      component: () => import(/* webpackChunkName: "diag" */ "./views/Diag.vue")
    }
  ]
});

// handle authentication before each route is processed
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (store.getters["auth/isLoggedIn"]) {
      // the user is authenticated
      next();
    } else if (
      // the user is not authenticated
      // see if we can get an accessToken via refresh
      store.state.auth.refreshToken &&
      store.dispatch("auth/refresh")
    ) {
      // the refresh was successful, we now have an accessToken
      // or we the refresh token was revoked and we were logged out.
      next();
    } else {
      // the user needs to login.  Save the path for a future redirect.
      next({
        path: "/login",
        query: { redirect: to.fullPath }
      });
    }
  } else {
    // this route does not require authentication
    next(); // make sure to always call next()!
  }
});

// handle authentication before each route is processed
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresFreshAuth)) {
    // this route requires a "fresh" acessToken
    // if not, redirect to login page to get one.
    if (store.getters["auth/isFresh"]) {
      // the user is authenticated with a fresh token
      next();
    } else {
      // the user is not authenticated with a fresh token
      next({
        path: "/login",
        query: { redirect: to.fullPath }
      });
    }
  } else {
    // this route does not require fresh authentication
    next(); // make sure to always call next()!
  }
});

export default router;

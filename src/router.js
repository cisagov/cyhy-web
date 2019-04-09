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
        requiresAuth: true
      }
    },
    {
      path: "/about",
      name: "about",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue"),
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
      path: "/secure",
      name: "secure",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue"),
      meta: {
        requiresAuth: true
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
    } else {
      // the user is not authenticated
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

export default router;

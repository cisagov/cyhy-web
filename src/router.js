import Vue from "vue";
import Router from "vue-router";
//import Home from "./views/Home.vue";

Vue.use(Router);

// route level code-splitting
// this generates a separate chunk (component.[hash].js) for each route
// which is lazy-loaded when the route is visited.

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import(/* webpackChunkName: "home" */ "./views/Home.vue")
    },
    {
      path: "/about",
      name: "about",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
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
    }
  ]
});

import Vue from "vue";
import Router from "vue-router";

import List from "./views/List.vue";
import Crawler from "./views/Crawler.vue";
import Login from "./views/Login.vue";
import Overview from "./views/Overview.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "list",
      component: List
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/crawler",
      name: "crawler",
      component: Crawler
    },
    {
      path: "/:id",
      name: "overview",
      component: Overview
    }
  ]
});

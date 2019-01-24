import Vue from "vue";

import "roboto-fontface/css/roboto/roboto-fontface.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";

import App from "./App.vue";
import router from "./router";
import store from "./store";

import "./plugins/vuetify";
import "./plugins/axios";

router.beforeEach((to, from, next) => {
  if (!store.getters.isAuthenticated && to.name !== "login") {
    router.push("/login");
  }
  next();
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

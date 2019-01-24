"use strict";

import Vue from "vue";
import axios from "axios";

import store from "../store";

let config = {
  baseURL: process.env.VUE_APP_API_ENDPOINT || ""
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function(config) {
    config = {
      ...config,
      headers: {
        Authorization: `Bearer ${store.getters.authToken}`
      }
    };
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

_axios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    return Promise.reject(error);
  }
);

Plugin.install = function(Vue) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    }
  });
};

Vue.use(Plugin);

export default Plugin;

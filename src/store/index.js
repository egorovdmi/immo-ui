import Vue from "vue";
import Vuex from "vuex";
import createLogger from "vuex/dist/logger";

import actions from "./actions";
import mutations from "./mutations";
import createMessagingPlugin from "./messaging-plugin";

Vue.use(Vuex);

export default new Vuex.Store({
  actions,
  mutations,
  plugins: [createMessagingPlugin(), createLogger()],
  state: {
    exposeList: [],
    crawlerList: [],
    messagingError: null,
    lastReceivedNotification: null,
    authToken: localStorage.getItem("authToken"),
    pushToken: localStorage.getItem("pushToken")
  },
  getters: {
    isAuthenticated(state) {
      return state.authToken !== null;
    },
    authToken(state) {
      return state.authToken;
    },
    pushToken(state) {
      return state.pushToken;
    },
    messagingError(state) {
      return state.messagingError;
    },
    exposeList(state) {
      return state.exposeList;
    },
    crawlerList(state) {
      return state.crawlerList;
    },
    lastReceivedNotification(state) {
      return state.lastReceivedNotification;
    }
  }
});

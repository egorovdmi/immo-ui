import {
  MUTATION_CLEAR,
  MUTATION_SET_AUTH_TOKEN,
  MUTATION_SET_PUSH_TOKEN,
  MUTATION_SET_MESSAGING_ERROR,
  MUTATION_SET_EXPOSE_LIST,
  MUTATION_ADD_EXPOSE_TO_LIST,
  MUTATION_UPDATE_EXPOSE_IN_LIST,
  MUTATION_SET_CRAWLER_LIST,
  MUTATION_ADD_URL_TO_CRAWLER_LIST,
  MUTATION_REMOVE_URL_FROM_CRAWLER_LIST,
  MUTATION_ADD_RECEIVED_NEW_NOTIFICATION,
  MUTATION_REMOVE_RECEIVED_NEW_NOTIFICATION
} from "./constants";

export default {
  [MUTATION_CLEAR](state) {
    state.expose = null;
    state.authToken = null;
    state.pushToken = null;
  },
  [MUTATION_SET_AUTH_TOKEN](state, token) {
    state.authToken = token;
  },
  [MUTATION_SET_PUSH_TOKEN](state, token) {
    state.pushToken = token;
  },
  [MUTATION_SET_MESSAGING_ERROR](state, errorCode) {
    state.messagingError = errorCode;
  },
  [MUTATION_SET_EXPOSE_LIST](state, exposeList) {
    state.exposeList = exposeList;
  },
  [MUTATION_ADD_EXPOSE_TO_LIST](state, expose) {
    if (!state.exposeList.find(item => item.id === expose.id)) {
      state.exposeList.push(expose);
    }
  },
  [MUTATION_UPDATE_EXPOSE_IN_LIST](state, expose) {
    const index = state.exposeList.findIndex(item => item.id === expose.id);
    state.exposeList[index] = expose;
    state.exposeList = JSON.parse(JSON.stringify(state.exposeList));
  },
  [MUTATION_SET_CRAWLER_LIST](state, crawlerList) {
    state.crawlerList = crawlerList;
  },
  [MUTATION_ADD_URL_TO_CRAWLER_LIST](state, url) {
    state.crawlerList.push({ url });
  },
  [MUTATION_REMOVE_URL_FROM_CRAWLER_LIST](state, url) {
    const index = state.crawlerList.findIndex(item => item.url === url);
    state.crawlerList.splice(index - 1, 1);
  },
  [MUTATION_ADD_RECEIVED_NEW_NOTIFICATION](state, title) {
    state.lastReceivedNotification = title;
  },
  [MUTATION_REMOVE_RECEIVED_NEW_NOTIFICATION](state) {
    state.lastReceivedNotification = null;
  }
};

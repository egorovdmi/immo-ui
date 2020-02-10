import axios from "axios";

import {
  ACTION_LOGIN,
  ACTION_LOGOUT,
  ACTION_HIDE_EXPOSE,
  ACTION_MARK_EXPOSE_AS_CONTACTED,
  ACTION_DOWNLOAD_NEW_EXPOSE,
  MUTATION_CLEAR,
  MUTATION_ADD_EXPOSE_TO_LIST,
  MUTATION_SET_AUTH_TOKEN,
  MUTATION_UPDATE_EXPOSE_IN_LIST,
  ACTION_ADD_URL_TO_CRAWLER_LIST,
  ACTION_REMOVE_URL_FROM_CRAWLER_LIST,
  MUTATION_ADD_URL_TO_CRAWLER_LIST,
  MUTATION_REMOVE_URL_FROM_CRAWLER_LIST
} from "./constants";

export default {
  async [ACTION_LOGIN]({ commit }, { email, password }) {
    const { data } = await axios({
      method: "POST",
      url: `${process.env.VUE_APP_API_ENDPOINT}/api/users/token`,
      data: {
        email,
        password
      }
    });

    localStorage.setItem("authToken", data.token);
    commit(MUTATION_SET_AUTH_TOKEN, data.token);
  },
  async [ACTION_LOGOUT]({ commit }) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("pushToken");
    commit(MUTATION_CLEAR);
  },
  async [ACTION_DOWNLOAD_NEW_EXPOSE]({ commit, state }, id) {
    const { data } = await axios({
      url: `${process.env.VUE_APP_API_ENDPOINT}/api/expose/${id}`,
      headers: {
        Authorization: `Bearer ${state.authToken}`
      }
    });

    commit(MUTATION_ADD_EXPOSE_TO_LIST, data);
  },
  async [ACTION_HIDE_EXPOSE]({ commit, state }, expose) {
    const { data } = await axios({
      url: `${process.env.VUE_APP_API_ENDPOINT}/api/expose/hide`,
      method: "POST",
      data: {
        id: expose.id,
        createdAt: expose.createdAt
      },
      headers: {
        Authorization: `Bearer ${state.authToken}`
      }
    });

    commit(MUTATION_UPDATE_EXPOSE_IN_LIST, data);
  },
  async [ACTION_MARK_EXPOSE_AS_CONTACTED]({ commit, state }, expose) {
    const { data } = await axios({
      url: `${process.env.VUE_APP_API_ENDPOINT}/api/expose/contacted`,
      method: "POST",
      data: {
        id: expose.id
      },
      headers: {
        Authorization: `Bearer ${state.authToken}`
      }
    });

    commit(MUTATION_UPDATE_EXPOSE_IN_LIST, data);
  },
  async [ACTION_ADD_URL_TO_CRAWLER_LIST]({ commit, state }, url) {
    await axios({
      url: `${process.env.VUE_APP_API_ENDPOINT}/api/crawler/add`,
      method: "POST",
      data: { url },
      headers: {
        Authorization: `Bearer ${state.authToken}`
      }
    });

    commit(MUTATION_ADD_URL_TO_CRAWLER_LIST, url);
  },
  async [ACTION_REMOVE_URL_FROM_CRAWLER_LIST]({ commit, state }, url) {
    await axios({
      url: `${process.env.VUE_APP_API_ENDPOINT}/api/crawler/remove`,
      method: "POST",
      data: { url },
      headers: {
        Authorization: `Bearer ${state.authToken}`
      }
    });

    commit(MUTATION_REMOVE_URL_FROM_CRAWLER_LIST, url);
  }
};

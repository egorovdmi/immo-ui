<template>
  <div>
    <v-alert :value="alreadyAdded" dismissible type="error">URL wurde schon hinzugefügt.</v-alert>
    <form>
      <v-text-field v-model="url" label="Url" data-vv-name="name" required></v-text-field>
      <v-btn @click="addUrlToCrawlerList">hinzufügen</v-btn>
    </form>

    <v-list>
      <v-list-tile v-for="item in crawlerList" :key="item.url">
        <v-list-tile-content @click="openUrl(item.url)">
          <v-list-tile-title>{{item.url}}</v-list-tile-title>
          <v-list-tile-sub-title>Zuletzt aktualisiert: {{item.lastTimeCrawled}}</v-list-tile-sub-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-icon color="red" @click="removeUrlFromCrawlerList(item.url)">delete</v-icon>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { format } from "date-fns";

import {
  ACTION_ADD_URL_TO_CRAWLER_LIST,
  ACTION_REMOVE_URL_FROM_CRAWLER_LIST,
  MUTATION_SET_CRAWLER_LIST
} from "../store/constants";

export default {
  data: () => ({ url: null, alreadyAdded: false }),
  async created() {
    const { data } = await this.$axios("/api/crawler");
    this.$store.commit(MUTATION_SET_CRAWLER_LIST, data);
  },
  computed: {
    crawlerList() {
      return this.$store.getters.crawlerList.map(item => ({
        ...item,
        lastTimeCrawled: format(item.lastTimeCrawled, "dd.MM.yyyy HH:mm")
      }));
    }
  },
  methods: {
    openUrl(url) {
      window.open(url);
    },
    addUrlToCrawlerList() {
      if (this.crawlerList.find(item => item.url === this.url)) {
        this.alreadyAdded = true;
        return;
      }

      this.$store.dispatch(ACTION_ADD_URL_TO_CRAWLER_LIST, this.url);
    },
    removeUrlFromCrawlerList(url) {
      this.$store.dispatch(ACTION_REMOVE_URL_FROM_CRAWLER_LIST, url);
    }
  }
};
</script>

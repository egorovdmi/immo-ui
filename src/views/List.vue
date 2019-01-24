<template>
  <v-layout row wrap>
    <v-flex xs4 offset-xs8>
      <v-select :items="items" v-model="filter" label="Exposé Filter" outline></v-select>
    </v-flex>
    <v-flex xs12>
      <v-progress-circular
        v-if="isLoading && exposeList.length === 0"
        :size="50"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </v-flex>
    <v-flex v-if="!isLoading && exposeList.length === 0">
      <v-alert :value="true" color="info" icon="info" outline>Keine Exposés gefunden.</v-alert>
    </v-flex>
    <v-flex xs12 sm6 lg3 v-for="(item, index) in exposeList" :key="index">
      <v-card>
        <v-carousel dark hide-delimiters :cycle="false" height="300px">
          <v-carousel-item v-for="(item, i) in item.images" :key="i" :src="item"></v-carousel-item>
        </v-carousel>

        <v-card-title primary-title>
          <div class="headline text-truncate">{{ item.title }}</div>
        </v-card-title>

        <v-list>
          <v-layout row wrap>
            <v-flex xs6>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>Bezugsfrei ab</v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.availableFrom"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile v-if="item.lastRenovated">
                <v-list-tile-content>
                  <v-list-tile-title>Renoviert</v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.lastRenovated"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile v-if="item.livingArea">
                <v-list-tile-content>
                  <v-list-tile-title>Wohnraum</v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.livingArea"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile v-if="item.rooms">
                <v-list-tile-content>
                  <v-list-tile-title>Zimmer</v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.rooms"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile v-if="item.constructionYear">
                <v-list-tile-content>
                  <v-list-tile-title>Baujahr</v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.constructionYear"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile v-if="item.energyType">
                <v-list-tile-content>
                  <v-list-tile-title>Heizung</v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.energyType"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-flex>
            <v-flex xs6>
              <v-list-tile v-if="item.coldRent">
                <v-list-tile-content>
                  <v-list-tile-title>Kaltmiete</v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.coldRent"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile v-if="item.heatingCosts">
                <v-list-tile-content>
                  <v-list-tile-title>Heizkosten</v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.heatingCosts"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile v-if="item.utilities">
                <v-list-tile-content>
                  <v-list-tile-title>Nebenkosten</v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.utilities"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile v-if="item.totalRent">
                <v-list-tile-content>
                  <v-list-tile-title>Gesamtmiete</v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.totalRent"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile v-if="item.type">
                <v-list-tile-content>
                  <v-list-tile-title>Wohnungstyp</v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.type"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>

              <v-list-tile v-if="item.address">
                <v-list-tile-content>
                  <v-list-tile-title>Adresse</v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.address"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-flex>
          </v-layout>
        </v-list>

        <v-card-actions>
          <v-btn flat @click="$router.push('/' + item.id)">mehr Infos</v-btn>
          <v-spacer></v-spacer>
          <v-btn flat v-if="filter === 'offers'" @click="hideExpose(item)">aus­blen­den</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex xs12>
      <v-pagination v-if="pages > 1" v-model="page" :length="pages" circle></v-pagination>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions } from "vuex";

import {
  ACTION_HIDE_EXPOSE,
  MUTATION_SET_EXPOSE_LIST
} from "../store/constants";

const EXPOSE_PER_PAGE = 12;

const filterExpose = (item, filter) => {
  if (filter === "offers") {
    return !(item.isHidden === true || item.hasBeenContacted === true);
  } else if (filter === "hidden") {
    return item.isHidden === true;
  } else if (filter === "contacted") {
    return item.hasBeenContacted === true;
  }
};

export default {
  data: () => ({
    page: 1,
    isLoading: true,
    filter: "offers",
    items: [
      { text: "Angebote", value: "offers" },
      { text: "Ausgeblendet", value: "hidden" },
      { text: "Beworben", value: "contacted" }
    ]
  }),
  async created() {
    const { data } = await this.$axios("/api/expose");
    this.$store.commit(MUTATION_SET_EXPOSE_LIST, data);
    this.isLoading = false;
  },
  computed: {
    pages() {
      if (!this.exposeList) {
        return 0;
      }

      return Math.round(this.exposeList.length / EXPOSE_PER_PAGE);
    },
    exposeList() {
      return this.$store.getters.exposeList
        .filter(item => filterExpose(item, this.filter))
        .splice(this.page * EXPOSE_PER_PAGE - EXPOSE_PER_PAGE, EXPOSE_PER_PAGE);
    }
  },
  methods: {
    ...mapActions({
      hideExpose: ACTION_HIDE_EXPOSE
    })
  }
};
</script>

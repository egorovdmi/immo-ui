<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-alert
        :value="!isLoading && !expose"
        color="info"
        icon="info"
        outline
      >Exposé nicht gefunden.</v-alert>
      <v-progress-circular v-if="isLoading && !expose" :size="50" color="primary" indeterminate></v-progress-circular>
      <v-card v-if="expose">
        <v-layout row wrap>
          <v-card-title primary-title>
            <div class="headline">{{ expose.title }}</div>
          </v-card-title>
          <v-flex xs12>
            <v-carousel v-if="expose.images" dark hide-delimiters :cycle="false">
              <v-carousel-item v-for="(item, i) in expose.images" :key="i" :src="item"></v-carousel-item>
            </v-carousel>
          </v-flex>

          <v-flex xs12 lg6>
            <v-card-text>{{ expose.description }}</v-card-text>
          </v-flex>
          <v-flex xs12 lg6>
            <v-list>
              <v-layout row wrap>
                <v-flex xs6>
                  <v-list-tile>
                    <v-list-tile-content>
                      <v-list-tile-title>Bezugsfrei ab</v-list-tile-title>
                      <v-list-tile-sub-title v-html="expose.availableFrom"></v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>

                  <v-list-tile v-if="expose.lastRenovated">
                    <v-list-tile-content>
                      <v-list-tile-title>Renoviert</v-list-tile-title>
                      <v-list-tile-sub-title v-html="expose.lastRenovated"></v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>

                  <v-list-tile v-if="expose.livingArea">
                    <v-list-tile-content>
                      <v-list-tile-title>Wohnraum</v-list-tile-title>
                      <v-list-tile-sub-title v-html="expose.livingArea"></v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>

                  <v-list-tile v-if="expose.rooms">
                    <v-list-tile-content>
                      <v-list-tile-title>Zimmer</v-list-tile-title>
                      <v-list-tile-sub-title v-html="expose.rooms"></v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>

                  <v-list-tile v-if="expose.constructionYear">
                    <v-list-tile-content>
                      <v-list-tile-title>Baujahr</v-list-tile-title>
                      <v-list-tile-sub-title v-html="expose.constructionYear"></v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>

                  <v-list-tile v-if="expose.energyType">
                    <v-list-tile-content>
                      <v-list-tile-title>Heizung</v-list-tile-title>
                      <v-list-tile-sub-title v-html="expose.energyType"></v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-flex>
                <v-flex xs6>
                  <v-list-tile v-if="expose.coldRent">
                    <v-list-tile-content>
                      <v-list-tile-title>Kaltmiete</v-list-tile-title>
                      <v-list-tile-sub-title v-html="expose.coldRent"></v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>

                  <v-list-tile v-if="expose.heatingCosts">
                    <v-list-tile-content>
                      <v-list-tile-title>Heizkosten</v-list-tile-title>
                      <v-list-tile-sub-title v-html="expose.heatingCosts"></v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>

                  <v-list-tile v-if="expose.utilities">
                    <v-list-tile-content>
                      <v-list-tile-title>Nebenkosten</v-list-tile-title>
                      <v-list-tile-sub-title v-html="expose.utilities"></v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>

                  <v-list-tile v-if="expose.totalRent">
                    <v-list-tile-content>
                      <v-list-tile-title>Gesamtmiete</v-list-tile-title>
                      <v-list-tile-sub-title v-html="expose.totalRent"></v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>

                  <v-list-tile v-if="expose.type">
                    <v-list-tile-content>
                      <v-list-tile-title>Wohnungstyp</v-list-tile-title>
                      <v-list-tile-sub-title v-html="expose.type"></v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>

                  <v-list-tile v-if="expose.address">
                    <v-list-tile-content>
                      <v-list-tile-title>Adresse</v-list-tile-title>
                      <v-list-tile-sub-title v-html="expose.address"></v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-flex>
              </v-layout>
            </v-list>
          </v-flex>
          <v-flex xs12>
            <iframe
              width="100%"
              height="400"
              :src="
                'https://maps.google.com/maps?width=390&height=447&hl=de&q=' +
                  expose.address +
                  '&ie=UTF8&t=&z=15&iwloc=B&output=embed'
              "
              frameborder="0"
              scrolling="no"
              marginheight="0"
              marginwidth="0"
            ></iframe>
          </v-flex>
        </v-layout>

        <v-card-actions>
          <v-btn flat @click="openExposeLink(expose)">Link öffnen</v-btn>
          <v-spacer></v-spacer>
          <v-btn flat @click="hideExpose(expose)">aus­blen­den</v-btn>
          <v-btn flat @click="markExposeAsContacted(expose)">als kontaktiert markieren</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import {
  ACTION_HIDE_EXPOSE,
  ACTION_MARK_EXPOSE_AS_CONTACTED,
  MUTATION_ADD_EXPOSE_TO_LIST
} from "../store/constants";

export default {
  data: () => ({ isLoading: true }),
  async created() {
    const { data } = await this.$axios(`/api/expose/${this.$route.params.id}`);
    this.$store.commit(MUTATION_ADD_EXPOSE_TO_LIST, data);
    this.isLoading = false;
  },
  computed: {
    expose() {
      return this.$store.getters.exposeList.find(expose => {
        return expose.id == this.$route.params.id;
      });
    }
  },
  methods: {
    async hideExpose(expose) {
      await this.$store.dispatch(ACTION_HIDE_EXPOSE, expose);
      this.$router.push("/");
    },
    async markExposeAsContacted(expose) {
      await this.$store.dispatch(ACTION_MARK_EXPOSE_AS_CONTACTED, expose);
      this.$router.push("/");
    },
    openExposeLink(expose) {
      window.open(`https://www.immobilienscout24.de/expose/${expose.id}`);
    }
  }
};
</script>

<template>
  <v-app>
    <v-toolbar v-if="isAuthenticated" app color="primary" dark>
      <v-toolbar-title>Immo</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn flat @click="$router.push('/')">Über­sicht</v-btn>
        <v-btn flat @click="$router.push('/crawler')">Crawler Liste</v-btn>
        <v-btn flat @click="logout">Logout</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container fluid grid-list-md>
        <v-alert
          dismissible
          :value="messagingError === 'messaging/permission-blocked'"
          outline
          type="error"
        >Es wurden die Berechtigungen zum senden von Benachrichtigungen blockiert.</v-alert>
        <v-alert
          dismissible
          :value="messagingError && messagingError !== 'messaging/permission-blocked'"
          outline
          type="error"
        >{{messagingError}}</v-alert>
        <router-view></router-view>
      </v-container>
    </v-content>
    <v-snackbar
      v-if="lastReceivedNotification"
      v-model="lastReceivedNotification"
      :bottom="true"
      :multi-line="'multi-line'"
    >
      {{ lastReceivedNotification.title }}
      <v-btn
        color="pink"
        flat
        @click="$router.push(`/${lastReceivedNotification.exposeId}`)"
      >anzeigen</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import { ACTION_LOGOUT } from "./store/constants";

export default {
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    messagingError() {
      return this.$store.getters.messagingError;
    },
    lastReceivedNotification() {
      return this.$store.getters.lastReceivedNotification;
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch(ACTION_LOGOUT);
      this.$router.push("/login");
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.v-content {
  padding: 0px !important;
}
</style>

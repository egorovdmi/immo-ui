<template>
  <v-container grid-list-xl text-xs-center>
    <v-layout row wrap>
      <v-flex xs12 sm10 md8 lg6 offset-xs0 offset-sm1 offset-md2 offset-lg3>
        <v-card>
          <v-card-text class="pt-4">
            <div>
              <v-form>
                <v-text-field label="Enter your e-mail address" v-model="email" required></v-text-field>
                <v-text-field
                  label="Enter your password"
                  v-model="password"
                  min="8"
                  type="password"
                  counter
                  required
                ></v-text-field>
                <v-layout justify-space-between>
                  <v-btn @click="submit">Login</v-btn>
                </v-layout>
              </v-form>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

import { ACTION_LOGIN } from "../store/constants";

export default {
  data() {
    return {
      email: "",
      password: ""
    };
  },
  created() {
    if (this.isAuthenticated) {
      this.$router.push("/");
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    }
  },
  methods: {
    ...mapActions({ login: ACTION_LOGIN }),
    async submit() {
      await this.login({ email: this.email, password: this.password });

      if (this.isAuthenticated) {
        this.$router.push("/");
      }
    }
  }
};
</script>

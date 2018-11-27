<template>
  <div>
    <div class="center-align">
      <img src="@/assets/neu_logo.png" width="156" height="156">
      <h2 class="white-text">Login</h2>

      <div class="row">
        <div class="input-field col s12" style="margin-top: 50px; margin-left: 30%; width: 40%;">
          <input id="first_name" type="text" class="validate white-text" v-model="username">
          <label for="first_name">First Name</label>
        </div>
        <div class="input-field col s12" style="margin-left: 30%; width: 40%;">
          <input id="last_name" type="password" class="validate white-text" v-model="password">
          <label for="last_name">Last Name</label>
        </div>
      </div>

      <a href="#!" class="waves-effect waves-light btn blue" id="btnLogin" @click="login()">Login
        <!-- <template v-if="this.redirectTo">
          <template v-if="this.redirectTo == 0">
            <router-link :to="{ name: 'Home', params: {judgeNumber: this.judgeNumber} }">
              Login
            </router-link>
          </template>
          <template v-else>
            <router-link :to="{ name: 'Submitted', params: {judgeNumber: this.judgeNumber} }">
              Login
            </router-link>
          </template>
        </template> -->
      </a>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {headers} from '@/scripts/headers'
import assignWindowLocation from '@/scripts/global-functions'

export default {
  data() {
    return {
      username: null,
      password: null,
      redirectTo: null,
      judgeNumber: null,
      tieBreaker: null,
      temp: "fuck"
    }
  },
  mounted() {
    this.username = null;
    this.password = null;
    this.redirectTo = null;
    this.judgeNumber = null;

    this.validateTieBreaker();
  },
  methods: {
    login() {
      axios.get('/api/judge_number/' + this.username + '/' + this.password)
        .then(response => {
          if(isNaN(response.data)) {
            Materialize.toast(response.data, 3000, "rounded");
            this.username = null;
            this.password = null;
          } else {
            console.log(response.data + " is still a number");
            var judgeNumberTemp = response.data;
            judgeNumberTemp = judgeNumberTemp.toString();

            this.judgeNumber = judgeNumberTemp.replace(judgeNumberTemp.charAt(0), "");
            this.redirectTo = judgeNumberTemp.replace(this.judgeNumber, "");

            console.log("judgeNumber and redirectTo - " + this.judgeNumber + " and " + this.redirectTo);

            // TODO: Function here for updating isUserLoggedIn to true
            if(this.redirectTo == 0) {
              this.updateUserLoggedInToTrue();
              // Check if tie breaker is true if true redirect to tie_breaker else home
              if(this.tieBreaker) {
                assignWindowLocation("/" + this.judgeNumber + "/tie_breaker");
              } else {
                assignWindowLocation("/" + this.judgeNumber + "/home");
              }
            } else if(this.redirectTo == 1) {
              this.updateUserLoggedInToTrue();
              assignWindowLocation("/" + this.judgeNumber + "/submitted")
            }
          }
        })
        .catch(e => {
          console.log(e);
        })
    },
    updateUserLoggedInToTrue() {
      axios.post('/api/set_user_logged_in/' + true + '/' + this.judgeNumber, {headers: headers})
        .then(response => {
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        })
    },
    validateTieBreaker() {
      // If tied, block at this page then redirect to tieBreaker page to choose between those participants
      axios.get('/api/rankings/validate')
        .then(response => {
          this.tieBreaker = response.data;
          console.log(this.tieBreaker + " <- tieBreaker");
        })
        .catch(e => {
          console.log(e);
        })
    }
    // assignWindowLocation(pathname) {
    //   const protocol = window.location.protocol;
    //   const hostname = window.location.hostname;
    //   const port = window.location.port; // Remove if necessary
    //   // const pathname = "/submitted";
    //
    //   return window.location.replace(protocol + "//" + hostname + ":" + port + pathname);
    // }
  }
}
</script>

<style scoped>
</style>

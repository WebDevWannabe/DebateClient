<template>
  <div>
    <div class="center-align">
      <h2 class="white-text">The scores are submitted successfully!</h2>
      <a href="#" @click="goToRankings()">Check Rankings</a>
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
      judgeNumber: null,
      isUserLoggedIn: null,
      tieBreaker: null,
      finalBtnSubmitClicked: null,
      rankings: []
    }
  },
  created() {
    // Get judgeNumber then pass data
    this.judgeNumber = this.$route.params.judgeNumber;

    // Check user if logged in
    this.getUserLoggedIn();

    // Check if users already done scoring
    this.getSubmitButtonClickedValidation();

    // Update current rankings
    this.getRankings();

    // Check if there's a tie breaker
    this.validateTieBreaker();
  },
  mounted() {
  },
  methods: {
    getUserLoggedIn() {
      axios.get('/api/user_logged_in/' + this.judgeNumber)
        .then(response => {
          console.log("user logged in " + response.data);
          this.isUserLoggedIn = response.data;
          this.updateUserLoggedInToFalse();

          if(!this.isUserLoggedIn) {
            assignWindowLocation("/");
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
    updateUserLoggedInToFalse() {
      axios.post('/api/set_user_logged_in/' + false + '/' + this.judgeNumber, {headers: headers})
        .then(response => {
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        })
    },
    getRankings() {
      axios.get('/api/rankings/rank')
        .then(response => {
          this.rankings = response.data;
          console.log(this.rankings.length + " <- rankings length");
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
    },
    getSubmitButtonClickedValidation() {
      axios.get('/api/all/submit_button_clicked')
        .then(response => {
          console.log("From getSubmitButtonClickedValidation -> " + response.data);
          this.finalBtnSubmitClicked = response.data;
        })
        .catch(e => {
          console.log(e);
        })
    },
    goToRankings() {
      this.getSubmitButtonClickedValidation();
      this.validateTieBreaker();
      if(this.finalBtnSubmitClicked && !this.tieBreaker) {
        this.updateUserLoggedInToTrue();
        // if(this.tieBreaker) {
          //assignWindowLocation("/"); // go to tieBreaker page (battle for 1-3 spot, center modals)
          // assignWindowLocation("/" + this.judgeNumber + "/tie_breaker")
        // } else {
          assignWindowLocation("/" + this.judgeNumber + "/rankings");
      } else if (this.finalBtnSubmitClicked && this.tieBreaker) {
        this.updateUserLoggedInToTrue();
        assignWindowLocation("/" + this.judgeNumber + "/tie_breaker")
      } else {
        Materialize.toast("Other judges are still scoring, please wait..", 3000, "rounded");
      }
    }
  }
}
</script>

<style scoped>
</style>

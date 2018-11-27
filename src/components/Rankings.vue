<template>
  <div>
    <!-- Get systemTitle + "Rankings" -->
    <div class="row header">
      <div class="col s2"  style="margin-top: -60px;">
        <img src="@/assets/neu_logo.png" width="108" height="108" id="teamLogo">
      </div>
      <div class="col s8"  style="margin-top: -30px;">
        <h4 class="left-align">{{ systemTitle }} Rankings</h4> <!-- Insert systemTitle -->
      </div>
      <div class="col s2" style="margin-top: -15px;">
        <!-- <a href="#!" class="waves-effect waves-light btn blue" id="btnSubmit" @click="submitFinalizedScore()">Submit</a> -->
      </div>
    </div>
    <div class="container">
      <div class="collection" v-for="(teamName, i) in teamNames">
        <div href="#!" class="collection-item card-panel grey darken-3 white-text" v-if="rankings[i] == 1">
          <span class="new badge blue" data-badge-caption="placer">{{ rankings[i] }}st</span>
          <h5>{{ teamName }}</h5>
          <span style="margin-left: -5%;">from College of {{ collegeNames[i] }} - Final Score: {{ roundUpTwoDecimalPlaces(finalScores[i]) }}</span>
        </div>
        <div href="#!" class="collection-item card-panel grey darken-3 white-text" v-else-if="rankings[i] == 2">
          <span class="new badge blue" data-badge-caption="placer">{{ rankings[i] }}nd</span>
          <h5>{{ teamName }}</h5>
          <span style="margin-left: -5%">from College of {{ collegeNames[i] }} - Final Score: {{ roundUpTwoDecimalPlaces(finalScores[i]) }}</span>
        </div>
        <div href="#!" class="collection-item card-panel grey darken-3 white-text" v-else-if="rankings[i] == 3">
          <span class="new badge blue" data-badge-caption="placer">{{ rankings[i] }}rd</span>
          <h5>{{ teamName }}</h5>
          <span style="margin-left: -5%;">from College of {{ collegeNames[i] }} - Final Score: {{ roundUpTwoDecimalPlaces(finalScores[i]) }}</span>
        </div>
        <div href="#!" class="collection-item card-panel grey darken-3 white-text" v-else>
          <span class="new badge red" data-badge-caption="placer">{{ rankings[i] }}th</span>
          <h5>{{ teamName }}</h5>
          <span style="margin-left: -5%;">from College of {{ collegeNames[i] }} - Final Score: {{ roundUpTwoDecimalPlaces(finalScores[i]) }}</span>
        </div>
      </div>
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
      systemTitle: null,
      rankings: [],
      teamNames: [],
      collegeNames: [],
      finalScores: []
    }
  },
  created() {
    // Get judgeNumber then pass data
    this.judgeNumber = this.$route.params.judgeNumber;

    // Check user if logged in
    this.getUserLoggedIn();

    // Get Rankings from DB
    this.getRankings();
  },
  mounted() {
    // Get System Title from DB
    this.getSystemTitle();

    // Get Team Names from DB
    this.getTeamNames();

    // Get College Names from DB
    this.getCollegeNames();

    // Get Final Scores from DB
    this.getFinalScores();
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
    updateUserLoggedInToFalse() {
      axios.post('/api/set_user_logged_in/' + false + '/' + this.judgeNumber, {headers: headers})
        .then(response => {
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        })
    },
    getSystemTitle() {
      axios.get('/api/system_title')
        .then(response => {
          this.systemTitle = response.data;
          console.log(response.data + " response data from getSystemTitle");
        })
        .catch(e => {
          console.log(e);
        })
    },
    getRankings() {
      axios.get('/api/rankings/rank')
        .then(response => {
          this.rankings = response.data;
          console.log(this.rankings + " <- rankings");
        })
        .catch(e => {
          console.log(e);
        })
    },
    getTeamNames() {
      axios.get('/api/rankings/team_names')
        .then(response => {
          this.teamNames = response.data;
          console.log(this.teamNames);
        })
        .catch(e => {
          console.log(e);
        })
    },
    getCollegeNames() {
      axios.get('/api/rankings/college_names')
        .then(response => {
          this.collegeNames = response.data;
          console.log(this.collegeNames);
        })
        .catch(e => {
          console.log(e);
        })
    },
    getFinalScores() {
      axios.get('/api/rankings/final_score')
        .then(response => {
          this.finalScores = response.data;
          console.log(this.finalScores);
        })
        .catch(e => {
          console.log(e);
        })
    },
    roundUpTwoDecimalPlaces(finalScore) {
      console.log("Final score -> " + finalScore);
      return (Math.round(finalScore * 10) / 10).toFixed(2);
    }
  }
}
</script>

<style scoped>
  .header {
    color: white;
  }

  #teamLogo {
    margin-top: 13px; /* -3px */
  }
</style>

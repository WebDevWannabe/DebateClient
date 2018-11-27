<template>
  <div>
    <div class="row header">
      <div class="col s2"  style="margin-top: -60px;">
        <img src="@/assets/neu_logo.png" width="108" height="108" id="teamLogo">
      </div>
      <div class="col s8"  style="margin-top: -30px;">
        <h4 class="left-align">{{ systemTitle }} Tie Breaker</h4> <!-- Insert systemTitle -->
      </div>
      <div class="col s2" style="margin-top: -15px;">
        <a href="#!" class="waves-effect waves-light btn blue" id="btnSubmit" @click="submitFinalizedScore()">Submit</a>
      </div>
    </div>
    <div class="container row content">
      <!-- Modal Trigger -->
      <!-- Just iterate the team list from db in server -->
      <a class="waves-effect waves-light btn modal-trigger card-panel grey darken-3 col s4" href="#modal1"
       id="team" v-for="(tiedTeamName, i) in tiedTeamNames" @click="getClickedTeamName(tiedTeamName, i)">
        <div class="row">
          <div class="col s2" id="cardFirstCol">
            <h6>{{ tiedRanks[i] }}</h6>
          </div>
          <div class="col s8" id="cardSecondCol">
            <p id="teamName">{{ tiedTeamName }}</p>
            <br />
            <p id="collegeName">College of {{ tiedCollegeNames[i] }}</p>
          </div>
          <div class="col s2" id="cardThirdCol">
            <h6 id="aveScore" class="green-text text-accent-2">{{ roundUpOneDecimalPlace(tiedAveScorePercentages[i]) }}</h6>
          </div>
        </div>
      </a>
      <!-- Modal Trigger End -->
    </div>

    <!-- Modal Structure -->
    <!-- Just iterate the team list from db in server -->
    <div id="modal1" class="modal">
      <a class="modal-action modal-close waves-effect waves-light btn-flat" id="btnClose"
      data-position="bottom" data-delay="50" data-tooltip="Close"><i class="material-icons">close</i></a>
      <div class="modal-content row">
        <div class="col s4">
          <h6>Test</h6> <!-- college logo or logo of 1st, 2nd, 3rd place -->
        </div>
        <div class="col s8 left-align">
          <h4>College of
            <br /><strong id="modalCollegeName">{{ tiedCollegeNames[this.i] }}</strong> <!-- College names from rankings -->
          </h4>
          <h4 id="modalTeamName">{{ this.tiedTeamName }}</h4>
          <!-- Criteria 1 -->
          <div class="criteria">
            <span>Criteria 1 ({{ percentageCriterias[0] * 100 }}%) : </span> <!-- Load criteria from utils -->
            <div class="input-field inline">
              <input type="number" v-model="score.score1"> <!-- Load scores from scores -->
              <label v-if="this.score.score1 != null" class="active">1 - 100</label>
              <label v-else>1 - 100</label>
            </div>
          </div>
          <!-- Criteria 2 -->
          <div class="criteria">
            <span>Criteria 2 ({{ percentageCriterias[1] * 100 }}%) : </span>
            <div class="input-field inline">
              <input type="number" v-model="score.score2">
              <label v-if="this.score.score2 != null" class="active">1 - 100</label>
              <label v-else>1 - 100</label>
            </div>
          </div>
          <!-- Criteria 3 -->
          <div class="criteria">
            <span>Criteria 3 ({{ percentageCriterias[2] * 100 }}%) : </span>
            <div class="input-field inline">
              <input type="number" v-model="score.score3">
              <label v-if="this.score.score3 != null" class="active">1 - 100</label>
              <label v-else>1 - 100</label>
            </div>
          </div>
          <!-- Criteria 4 -->
          <div class="criteria">
            <span>Criteria 4 ({{ percentageCriterias[3] * 100 }}%) : </span>
            <div class="input-field inline">
              <input type="number" v-model="score.score4">
              <label v-if="this.score.score4 != null" class="active">1 - 100</label>
              <label v-else>1 - 100</label>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <a href="#!" class="modal-action waves-effect waves-light btn blue"
         id="btnSubmit" @click="saveScores()">Submit</a>
      </div>
    </div>
    <!-- Modal End -->
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
      tiedTeamNames: [],
      tiedCollegeNames: [],
      tiedFinalScores: [],
      tiedRanks: [],
      tiedAveScorePercentages: [],
      percentageCriterias: [],
      score: {
        score1: null,
        score2: null,
        score3: null,
        score4: null,
        scorePercentage1: null,
        scorePercentage2: null,
        scorePercentage3: null,
        scorePercentage4: null,
        aveScorePercentage: null
      },
      tiedTeamName: null,
      i: null,
      boolContinue: true
    }
  },
  created() {
    // Get judgeNumber then pass data
    this.judgeNumber = this.$route.params.judgeNumber;

    // Check user if logged in
    this.getUserLoggedIn();

    // Load Info of Tied Teams
    this.loadTiedTeamsInfo();
  },
  mounted() {
    // Get System Title from DB
    this.getSystemTitle();

    // Get Percentage Criterias from DB
    this.getPercentageCriterias();

    // Get Tied Team Names
    this.getTiedTeamNames();

    // Get Tied College Names
    this.getTiedCollegeNames();

    // Get Tied Final Scores
    this.getTiedFinalScores();

    // Get Tied Ranks
    this.getTiedRanks();

    // Get Tied Ave Score Percentages
    this.getTiedAveScorePercentages();

    // Modal Init
    $('.modal').modal();

    // Tooltip Init
    $('#btnClose').tooltip({delay: 30});
  },
  methods: {
    getUserLoggedIn() {
      axios.get('/api/user_logged_in/' + this.judgeNumber)
        .then(response => {
          console.log("user logged in " + response.data);
          this.isUserLoggedIn = response.data;
          this.updateUserLoggedInToFalse();
          this.updateBtnSubmitClickedFalse();

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
    updateBtnSubmitClickedFalse() {
      var params = new URLSearchParams();
      params.append('judgeNumber', this.judgeNumber);

      axios.post('/api/submit_final_score/' + this.judgeNumber + "/false", params, {headers: headers})
        .then(response => {
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        })
    },
    loadTiedTeamsInfo() {
      axios.get('/api/tie_breaker/load')
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
          console.log(response.data + " response data from getSystemTitle");
          this.systemTitle = response.data;
        })
        .catch(e => {
          console.log(e);
        })
    },
    getPercentageCriterias() {
      axios.get('/api/percentage_criterias')
        .then(response => {
          this.percentageCriterias = response.data;
          console.log(this.percentageCriterias);
        })
        .catch(e => {
          console.log(e);
        })
    },
    getTiedTeamNames() {
      axios.get('/api/tie_breaker/team_names')
        .then(response => {
          this.tiedTeamNames = response.data;
          console.log("tiedTeamNames -> " + this.tiedTeamNames);
        })
        .catch(e => {
          console.log(e);
        })
    },
    getTiedCollegeNames() {
      axios.get('/api/tie_breaker/college_names')
        .then(response => {
          this.tiedCollegeNames = response.data;
          console.log("tiedCollegeNames -> " + this.tiedCollegeNames);
        })
        .catch(e => {
          console.log(e);
        })
    },
    getTiedFinalScores() {
      axios.get('/api/tie_breaker/final_scores')
        .then(response => {
          this.tiedFinalScores = response.data;
          console.log("tiedFinalScores -> " + this.tiedFinalScores);
        })
        .catch(e => {
          console.log(e);
        })
    },
    getTiedAveScorePercentages() {
      axios.get('/api/tie_breaker/' + this.judgeNumber  + '/ave_score_percentages')
        .then(response => {
          this.tiedAveScorePercentages = response.data;
          console.log(this.tiedAveScorePercentages + " response data from getTiedAveScorePercentages");
        })
        .catch(e => {
          console.log(e);
        })
    },
    getTiedRanks() {
      axios.get('/api/tie_breaker/ranks')
        .then(response => {
          this.tiedRanks = response.data;
          console.log("tiedRanks -> " + this.tiedRanks);
        })
        .catch(e => {
          console.log(e);
        })
    },
    getClickedTeamName(tiedTeamName, i) {
      this.tiedTeamName = tiedTeamName;
      this.i = i;

      console.log(this.tiedTeamName + " this is the clicked team name " + this.i + " this is the clicked index")

      axios.get('/api/scores/' + this.tiedTeamName + '/' + this.judgeNumber)
        .then(response => {
          console.log(response.data);
          if(response.data.score1 == undefined) {
            this.score.score1 = null;
            this.score.score2 = null;
            this.score.score3 = null;
            this.score.score4 = null;
          } else {
            this.score.score1 = response.data.score1;
            this.score.score2 = response.data.score2;
            this.score.score3 = response.data.score3;
            this.score.score4 = response.data.score4;
          }
          console.log(this.score.score1);
        })
        .catch(e => {
          console.log(e);
        })
    },
    validateFields() {
      console.log(this.score.score4);
      var scores = [];
      scores.push(this.score.score1);
      scores.push(this.score.score2);
      scores.push(this.score.score3);
      scores.push(this.score.score4);

      for(let i = 0; i < scores.length; i++) {
        if(scores[i] == null || scores[i] == "") {
          console.log(scores[i] + " the current score in iteration " + i);
          console.log("Please fill the fields first before submitting");
          Materialize.toast("Please fill the fields first before submitting", 3000, "rounded");
          this.boolContinue = false;
          break;
        } else if(scores[i] < 1 || scores[i] > 100) {
          console.log(scores[i] + " the current score in iteration " + i);
          console.log("Scores must be graded from 1 to 100 only");
          Materialize.toast("Scores must be graded from 1 to 100 only", 3000, "rounded");
          this.boolContinue = false;
          break;
        } else {
          this.boolContinue = true;
        }
      }
    },
    saveScores() {
      this.validateFields();
      console.log(this.boolContinue);

      if(this.boolContinue == true) {
        console.log(this.tiedTeamName + " teamName " + this.tiedCollegeNames[this.i] + " college name")

        this.calculateScoreAndTotalPercentage();

        var params = new URLSearchParams();
        params.append('judgeNumber', this.judgeNumber);
        params.append('teamName', this.tiedTeamName);
        params.append('collegeName', this.tiedCollegeNames[this.i]);
        params.append('score1', this.score.score1);
        params.append('score2', this.score.score2);
        params.append('score3', this.score.score3);
        params.append('score4', this.score.score4);
        params.append('scorePercentage1', this.score.scorePercentage1);
        params.append('scorePercentage2', this.score.scorePercentage2);
        params.append('scorePercentage3', this.score.scorePercentage3);
        params.append('scorePercentage4', this.score.scorePercentage4);
        params.append('aveScorePercentage', this.score.aveScorePercentage);

        axios.post('/api/submit', params, {headers: headers})
          .then(response => {
            console.log(response.data)
            Materialize.toast(response.data, 3000, "rounded")
            // this.getTeamNameForAveScorePecentage();
            // this.getAveScorePercentagesRaw();
            this.getTiedAveScorePercentages();
            // this.updateRankings();
            // this.getTiedFinalScores();
            $('#modal1').modal('close');
          })
          .catch(e => {
            console.log(e)
            Materialize.toast("There's an error encountered while saving scores", 3000, "rounded")
            $('#modal1').modal('close');
          })
      }
    },
    calculateScoreAndTotalPercentage() {
      // Get percentage of each score
      this.score.scorePercentage1 = this.score.score1 * this.percentageCriterias[0];
      this.score.scorePercentage2 = this.score.score2 * this.percentageCriterias[1];
      this.score.scorePercentage3 = this.score.score3 * this.percentageCriterias[2];
      this.score.scorePercentage4 = this.score.score4 * this.percentageCriterias[3];

      // Sum of score percentages
      var aveScorePercentageTemp = this.score.scorePercentage1 + this.score.scorePercentage2 + this.score.scorePercentage3
       + this.score.scorePercentage4;

      // Round Up the Sum
      this.score.aveScorePercentage = this.roundUpOneDecimalPlace(aveScorePercentageTemp);

       console.log("scorePercentage1 = " + this.score.scorePercentage1 + ", scorePercentage2 = " + this.score.scorePercentage2 +
       ", scorePercentage3 = " + this.score.scorePercentage3 + ", scorePercentage4 = " + this.score.scorePercentage4 +
       ", aveScorePercentage = " + this.score.aveScorePercentage);
    },
    updateRankings() {
      axios.get('/api/rankings/rank')
        .then(response => {
          this.rankings = response.data;
          console.log(this.rankings + " <- rankings");
        })
        .catch(e => {
          console.log(e);
        })
    },
    roundUpOneDecimalPlace(finalScore) {
      console.log("Final score -> " + finalScore);
      return (Math.round(finalScore * 10) / 10).toFixed(1);
    },
    submitFinalizedScore() {
      console.log("tiedAveScorePercentages length " + this.tiedAveScorePercentages.length + ", collegeNames length "
       + this.tiedCollegeNames.length);
       var isAllowed = true;

      for(let i = 0; i < this.tiedAveScorePercentages.length; i++) {
        if(this.tiedAveScorePercentages[i] == 0.0) {
          Materialize.toast("Please give scores to all participants before submitting it to finalized score", 3000, "rounded");
          isAllowed = false;
          break;
        }
      }
      if(isAllowed) {
        var params = new URLSearchParams();
        params.append('judgeNumber', this.judgeNumber);

        axios.post('/api/submit_final_score/' + this.judgeNumber + "/true", params, {headers: headers})
          .then(response => {
            console.log(response.data);
            this.updateUserLoggedInToTrue();
            assignWindowLocation("/" + this.judgeNumber + "/submitted")
          })
          .catch(e => {
            console.log(e);
          })
      }
    }
  }
}
</script>

<style scoped>
  .header {
    color: white;
  }

  /* Card */

  .content {
    margin-top: -10px;
  }

  .content > a {
    margin: 1% 1.3333333333%;
  }

  #team {
    height: 74px; /* -6px */
  }

  #teamLogo {
    margin-top: 13px; /* -3px */
  }

  #team > .row > #cardSecondCol > #teamName {
    font-size: 14px;
    font-weight: bold;
    margin-top: 3px; /* -4px */
    padding: 3px 0;
  }

  #team > .row > #cardSecondCol > #collegeName {
    font-size: 10px;
    font-weight: 300;
    opacity: 0.7;
    line-height: 15px;
    margin-top: -60px;
  }

  #team > .row > #cardThirdCol > #aveScore {
    margin-top: 28px; /* -2px */
    font-weight: bold;
    font-size: 16px;
  }

  /* Modal */
  #modal1, #modal1 > .modal-footer {
    background-color: #616161 ;
    color: white;
  }

  #btnClose {
    float: right;
    background-color: red;
    color: white;
  }

  #btnClose:hover {
  }

  #modal1 > .modal-content > .s8 > #modalCollegeName {
    text-transform: uppercase;
  }

  #modal1 > .modal-content > .s8 > #modalTeamName {
    font-weight: bold;
    margin-top: 20px;
  }

  #modal1 > .modal-content > .s8 > .criteria > span {
    font-weight: bold;
  }

  #modal1 > .modal-footer > #btnSubmit {
    margin: -20px 20px;
  }
</style>

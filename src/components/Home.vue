<template>
  <div>
    <div class="row header">
      <div class="col s2"  style="margin-top: -60px;">
        <img src="@/assets/neu_logo.png" width="108" height="108" id="teamLogo">
      </div>
      <div class="col s8"  style="margin-top: -30px;">
        <h4 class="left-align">{{ systemTitle }}</h4>
      </div>
      <div class="col s2" style="margin-top: -15px;">
        <a href="#!" class="waves-effect waves-light btn blue" id="btnSubmit" @click="submitFinalizedScore()">Submit</a>
      </div>
    </div>
    <div class="container row content">
      <!-- Modal Trigger -->
      <!-- Just iterate the team list from db in server -->
      <a class="waves-effect waves-light btn modal-trigger card-panel grey darken-3 col s4" href="#modal1"
       id="team" v-for="(teamName, i) in teamNames" @click="getClickedTeamName(teamName, i)">
        <div class="row">
          <div class="col s2" id="cardFirstCol">
            <img :src="getPathToLogo(collegeLogos[i])" width="48" height="48" id="teamLogo">
          </div>
          <div class="col s8" id="cardSecondCol">
            <p id="teamName">{{ teamName }}</p>
            <br />
            <p id="collegeName">College of {{ collegeNames[i] }}</p>
          </div>
          <!-- <template v-for="index1 in teamNames"> -->
            <!-- <template v-for="isTeamNameForAveScorePercentage in isTeamNameForAveScorePercentages"> -->
              <!-- teamNameForAveScorePercentages[index] == teamName v-if="isTeamNameForAveScorePercentages[i] == true"-->
              <div class="col s2" id="cardThirdCol">
                <!-- <template>{{ testing() }}</template> -->
                <h6 id="aveScore" class="green-text text-accent-2">{{ getAveScorePercentages(aveScorePercentages[i]) }}</h6>
              </div>
              <!-- <div class="col s2" id="cardThirdCol" v-else>
                <h6 id="aveScore" class="green-text text-accent-2">0.0</h6>
              </div> -->
            <!-- </template> -->
          <!-- </template> -->
          <!-- <template> {{test()}}</template> -->

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
          <img :src="getPathToLogo(collegeLogos[this.i])" width="156" height="156">
        </div>
        <div class="col s8 left-align">
          <h4>College of
            <br /><strong id="modalCollegeName">{{ collegeNames[this.i] }}</strong>
          </h4>
          <h4 id="modalTeamName">{{ this.teamName }}</h4>
          <!-- Criteria 1 -->
          <div class="criteria">
            <span>Criteria 1 ({{ percentageCriterias[0] * 100 }}%) : </span>
            <div class="input-field inline">
              <!-- TODO: validate field -->
              <input type="number" v-model="score.score1">
              <!-- If data is null class="" else class="active" -->
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
      systemTitle: null,
      percentageCriterias: [],
      teamNames: [],
      collegeNames: [],
      collegeLogos: [],
      aveScorePercentages: [],
      // teamNameForAveScorePercentages: [],
      // isTeamNameForAveScorePercentages: [],
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
      teamName: null,
      i: null,
      boolContinue: true,
      judgeNumber: null,
      isUserLoggedIn: null
      // count: 0
      // test: []
    }
  },
  created() {
    // Get judgeNumber then pass data
    this.judgeNumber = this.$route.params.judgeNumber;

    // TODO: get isUserLoggedIn, pass data to isUserLoggedIn then set isUserLoggedIn to false
    this.getUserLoggedIn();
  },
  mounted() {
    // Get System Title from DB
    this.getSystemTitle();

    // Get Percentage Criterias from DB
    this.getPercentageCriterias();

    // Get Team Names from DB
    this.getTeamNames();

    // Get College Names from DB
    this.getCollegeNames();

    // Get College Logos from DB
    this.getCollegeLogos();

    // Get Team Name for Average Score Percentage
    // this.getTeamNameForAveScorePecentage();

    // Get Average Score Percentages from DB
    this.getAveScorePercentagesRaw();

    // this.getIsTeamNameForAveScorePercentage();

    // Modal Init
    $('.modal').modal();

    // Tooltip Init
    $('#btnClose').tooltip({delay: 30});

    // Current judgeNumber
    console.log(this.judgeNumber + " this is the current judgeNumber logged in");
  },
  // beforeUpdate() {
  //   this.count = 0;
  // },
  methods: {
    // testing() {
      // this.count += 1;
      // console.log("getAveScorePercentages method. New counter value - " + this.count);
      // return this.count+=1
      // console.log(aveScorePercentage);
      // console.log(this.aveScorePercentages.length + " before shift");
      // this.aveScorePercentages.shift();
      // console.log(this.aveScorePercentages.length + " after shift");
    //   console.log(this.test + " testing push");
    //   return this.test.push("1");
    // },
    // getIsTeamNameForAveScorePercentage() {
    //   axios.get('/api/is_ave_score_percentages/' + this.judgeNumber)
    //     .then(response => {
    //       this.isTeamNameForAveScorePercentages = response.data;
    //       console.log("getIsTeamNameForAveScorePercentage method. Response data - " + this.isTeamNameForAveScorePercentages);
    //     })
    //     .catch(e => {
    //       console.log(e);
    //     })
    //
    //   // for(var i = 0; i < this.teamNames.length; i++) {
    //   //   for(var j = 0; j < this.teamNameForAveScorePercentages.length; j++) {
    //   //     if(this.teamNames[i] == this.teamNameForAveScorePercentages[j]) {
    //   //       this.isAveScorePercentages.push(true);
    //   //       console.log("isTeamNameForAveScorePercentages method. True" - this.teamNames[i]);
    //   //     }
    //   //   }
    //   //   this.isAveScorePercentages.push(false);
    //   //   console.log("isTeamNameForAveScorePercentages method. False" - this.teamNames[i]);
    //   // }
    // },
    getUserLoggedIn() {
      axios.get('/api/user_logged_in/' + this.judgeNumber)
        .then(response => {
          console.log("user logged in " + response.data);
          this.isUserLoggedIn = response.data;
          this.updateUserLoggedInToFalse();

          // TODO: check if this.isUserLoggedIn = true, allow at this page else redirect to home
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
    getTeamNames() {
      axios.get('/api/team_names')
        .then(response => {
          this.teamNames = response.data;
          console.log(this.teamNames.length);
        })
        .catch(e => {
          console.log(e);
        })
    },
    getCollegeNames() {
      axios.get('/api/college_names')
        .then(response => {
          this.collegeNames = response.data;
          console.log(this.collegeNames)
        })
        .catch(e => {
          console.log(e)
        })
    },
    getCollegeLogos() {
      axios.get('/api/college_logos')
        .then(response => {
          this.collegeLogos = response.data;
          console.log(this.collegeLogos)
        })
        .catch(e => {
          console.log(e)
        })
    },
    getClickedTeamName(teamName, i) {
      this.teamName = teamName;
      this.i = i;

      console.log(this.teamName + " this is the clicked team name " + this.i + " this is the clicked index")

      axios.get('/api/scores/' + this.teamName + '/' + this.judgeNumber)
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
    getPathToLogo(collegeLogoWithWhiteSpaces) {
      if(collegeLogoWithWhiteSpaces != undefined) {
        var collegeLogo = collegeLogoWithWhiteSpaces.replace(/\s/g, "");

        // console.log('@/assets/' + collegeLogo + '_logo.png');
        return require('@/assets/' + collegeLogo + '_logo.png');
      }
    },
    // getTeamNameForAveScorePecentage() {
    //   axios.get('/api/team_name/ave_score_percentage/' + this.judgeNumber)
    //     .then(response => {
    //       this.teamNameForAveScorePercentages = response.data;
    //       console.log(this.teamNameForAveScorePercentages + " response from teamNameForAveScorePercentages");
    //     })
    //     .catch(e => {
    //       console.log(e);
    //     })
    // },
    getAveScorePercentagesRaw() {
      axios.get('/api/ave_score_percentages/' + this.judgeNumber)
        .then(response => {
          this.aveScorePercentages = response.data;
          console.log(this.aveScorePercentages + " response data from getAveScorePercentagesRaw");
        })
        .catch(e => {
          console.log(e);
        })
    },
    getAveScorePercentages(aveScorePercentage) {
      console.log(aveScorePercentage + " the averageScorePercentage");
      // console.log(this.aveScorePercentages.length + " before shift");
      // this.aveScorePercentages.shift();
      // console.log(this.aveScorePercentages.length + " after shift");
      // if(!this.isCalledOnce) {
      //   console.log("Changing to called once true");
      //   this.isCalledOnce = true;
      // } else {

      // }
      return this.roundUpOneDecimalPlace(aveScorePercentage);
    },
    saveScores() {
      this.validateFields();
      console.log(this.boolContinue);

      if(this.boolContinue == true) {
        console.log(this.teamName + " teamName " + this.collegeNames[this.i] + " college name")

        this.calculateScoreAndTotalPercentage();

        var params = new URLSearchParams();
        params.append('judgeNumber', this.judgeNumber);
        params.append('teamName', this.teamName);
        params.append('collegeName', this.collegeNames[this.i]);
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
            this.getAveScorePercentagesRaw();
            $('#modal1').modal('close');
          })
          .catch(e => {
            console.log(e)
            Materialize.toast("There's an error encountered while saving scores", 3000, "rounded")
            $('#modal1').modal('close');
          })
      }
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
    roundUpOneDecimalPlace(num) {
      return (Math.round(num * 10) / 10).toFixed(1);
    },
    submitFinalizedScore() {
      console.log("aveScorePercentages length " + this.aveScorePercentages.length + ", collegeNames length "
       + this.collegeNames.length);
       var isAllowed = true;

      for(let i = 0; i < this.aveScorePercentages.length; i++) {
        if(this.aveScorePercentages[i] == 0.0) {
          Materialize.toast("Please give scores to all participants before submitting it to finalized score", 3000, "rounded");
          isAllowed = false;
          break;
        }
      }
      if(isAllowed) {
        var params = new URLSearchParams();
        params.append('judgeNumber', this.judgeNumber);

        axios.post('/api/submit_final_score/' + this.judgeNumber, params, {headers: headers})
          .then(response => {
            console.log(response.data);
            this.updateUserLoggedInToTrue();
            assignWindowLocation("/" + this.judgeNumber + "/submitted")
          })
          .catch(e => {
            console.log(e);
          })
      }
      // if(this.aveScorePercentages.length != this.collegeNames.length) {
      //   Materialize.toast("Please give scores to all participants before submitting it to finalized score", 3000, "rounded");
      // } else {
      //   var params = new URLSearchParams();
      //   params.append('judgeNumber', this.judgeNumber);
      //
      //   axios.post('/api/submit_final_score/' + this.judgeNumber, params, {headers: headers})
      //     .then(response => {
      //       console.log(response.data);
      //       assignWindowLocation("/" + this.judgeNumber + "/submitted")
      //     })
      //     .catch(e => {
      //       console.log(e);
      //     })
      // }
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

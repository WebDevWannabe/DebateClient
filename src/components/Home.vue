<template>
  <div>
    <div class="row header">
      <div class="col s2"  style="margin-top: -60px;">
        <img src="@/assets/neu_logo.png" width="108" height="108" id="teamLogo">
      </div>
      <div class="col s8"  style="margin-top: -30px;">
        <h4 class="left-align">Debate</h4>
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
          <div class="col s2" id="cardThirdCol">
            <h6 id="aveScore" class="green-text text-accent-2">{{ getAveScorePercentages(aveScorePercentages[i]) }}</h6>
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
          <img :src="getPathToLogo(collegeLogos[this.i])" width="156" height="156">
        </div>
        <div class="col s8 left-align">
          <h4>College of
            <br /><strong id="modalCollegeName">{{ collegeNames[this.i] }}</strong>
          </h4>
          <h4 id="modalTeamName">{{ this.teamName }}</h4>
          <!-- Criteria 1 -->
          <div class="criteria">
            <span>Arguments (40%) : </span>
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
            <span>Style and Delivery (30%) : </span>
            <div class="input-field inline">
              <input type="number" v-model="score.score2">
              <label v-if="this.score.score2 != null" class="active">1 - 100</label>
              <label v-else>1 - 100</label>
            </div>
          </div>
          <!-- Criteria 3 -->
          <div class="criteria">
            <span>Structure of Speech (20%) : </span>
            <div class="input-field inline">
              <input type="number" v-model="score.score3">
              <label v-if="this.score.score3 != null" class="active">1 - 100</label>
              <label v-else>1 - 100</label>
            </div>
          </div>
          <!-- Criteria 4 -->
          <div class="criteria">
            <span>Audience Impact (10%) : </span>
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

export default {
  data() {
    return {
      teamNames: [],
      collegeNames: [],
      collegeLogos: [],
      aveScorePercentages: [],
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
      boolContinue: true
    }
  },
  mounted() {
    // Get Team Names from DB
    this.getTeamNames();

    // Get College Names from DB
    this.getCollegeNames();

    // Get College Logos from DB
    this.getCollegeLogos();

    // Get Average Score Percentages from DB
    this.getAveScorePercentagesRaw();

    // Modal Init
    $('.modal').modal();

    // Tooltip Init
    $('#btnClose').tooltip({delay: 30});
  },
  methods: {
    getTeamNames() {
      axios.get('/api/team_names')
        .then(response => {
          this.teamNames = response.data;
          console.log(this.teamNames)
        })
        .catch(e => {
          console.log(e)
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

      axios.get('/api/scores/' + this.teamName)
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
    getAveScorePercentagesRaw() {
      axios.get('/api/ave_score_percentages')
        .then(response => {
          this.aveScorePercentages = response.data;
          console.log(this.aveScorePercentages);
        })
        .catch(e => {
          console.log(e);
        })
    },
    getAveScorePercentages(aveScorePercentage) {
      console.log(aveScorePercentage);
      if(aveScorePercentage == undefined) {
        aveScorePercentage = 0;
      }
      return this.roundUpOneDecimalPlace(aveScorePercentage);
    },
    saveScores() {
      this.validateFields();
      console.log(this.boolContinue);

      if(this.boolContinue == true) {
        console.log(this.teamName + " teamName " + this.collegeNames[this.i] + " college name")

        this.calculateScoreAndTotalPercentage();

        var params = new URLSearchParams();
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
            this.getAveScorePercentagesRaw();
            // TODO: Manually close the modal
            $('#modal1').modal('close');
          })
          .catch(e => {
            console.log(e)
            Materialize.toast("There's an error encountered while saving scores", 3000, "rounded")
            // TODO: Manually close the modal
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
      this.score.scorePercentage1 = this.score.score1 * 0.4;
      this.score.scorePercentage2 = this.score.score2 * 0.3;
      this.score.scorePercentage3 = this.score.score3 * 0.2;
      this.score.scorePercentage4 = this.score.score4 * 0.1;

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
      if(this.aveScorePercentages.length != this.collegeNames.length) {
        Materialize.toast("Please give scores to all participants before submitting it to finalized score", 3000, "rounded");
      } else {
        // TODO: Post in user table, update finalizing score column to 'true'

        const protocol = window.location.protocol;
        const hostname = window.location.hostname;
        const port = window.location.port; // Remove if necessary
        const pathname = "/submitted";
        window.location.replace(protocol + "//" + hostname + ":" + port + pathname);
        // console.log(protocol + "//" + hostname + ":" + port + pathname);
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

<template>
  <div>
    <div class="row header">
      <div class="col s2"  style="margin-top: -60px;">
        <img src="@/assets/neu_logo.png" width="108" height="108" id="bandLogo">
      </div>
      <div class="col s8"  style="margin-top: -30px;">
        <h4 class="left-align">Music Playlist</h4>
      </div>
      <div class="col s2" style="margin-top: -15px;">
        <a href="#!" class="modal-action modal-close waves-effect waves-light btn blue" id="btnSubmit">Submit</a>
      </div>
    </div>
    <div class="container row content">
      <!-- Modal Trigger -->
      <!-- Just iterate the band list from db in server -->
      <a class="waves-effect waves-light btn modal-trigger card-panel grey darken-3 col s4" href="#modal1"
       id="band" v-for="(bandName, i) in bandNames" @click="getClickedBandName(bandName, i)">
        <div class="row">
          <div class="col s2" id="cardFirstCol">
            <img :src="getPathToLogo(collegeLogos[i])" width="48" height="48" id="bandLogo">
          </div>
          <div class="col s8" id="cardSecondCol">
            <p id="bandName">{{ bandName }}</p>
            <br />
            <p id="collegeName">College of {{ collegeNames[i] }}</p>
          </div>
          <div class="col s2" id="cardThirdCol">
            <h6 id="aveScore">98.1</h6>
          </div>
        </div>
      </a>
      <!-- Modal Trigger End -->
    </div>

    <!-- Modal Structure -->
    <!-- Just iterate the band list from db in server -->
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
          <h4 id="modalBandName">{{ this.bandName }}</h4>
          <!-- Criteria 1 -->
          <div class="criteria">
            <span style="">Criteria 1 (10) : </span>
            <div class="input-field inline">
              <!-- TODO: validate field -->
              <input id="test" type="number" v-model="score.score1">
              <!-- If data is null class="" else class="active" -->
              <label v-if="this.score.score1 != null" for="test" class="active">1 - 10</label>
              <label v-else for="test">1 - 10</label>
            </div>
          </div>
          <!-- Criteria 2 -->
          <div class="criteria">
            <span style="">Criteria 2 (10) : </span>
            <div class="input-field inline">
              <input type="number" v-model="score.score2">
              <label v-if="this.score.score2 != null" for="last_name" class="active">1 - 10</label>
              <label v-else for="last_name">1 - 10</label>
            </div>
          </div>
          <!-- Criteria 3 -->
          <div class="criteria">
            <span style="">Criteria 3 (10) : </span>
            <div class="input-field inline">
              <input type="number" v-model="score.score3">
              <label v-if="this.score.score3 != null" for="last_name" class="active">1 - 10</label>
              <label v-else for="last_name">1 - 10</label>
            </div>
          </div>
          <!-- Criteria 4 -->
          <div class="criteria">
            <span style="">Criteria 4 (10) : </span>
            <div class="input-field inline">
              <input type="number" v-model="score.score4">
              <label v-if="this.score.score4 != null" for="last_name" class="active">1 - 10</label>
              <label v-else for="last_name">1 - 10</label>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <a href="#!" class="modal-action modal-close waves-effect waves-light btn blue"
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
      bandNames: [],
      collegeNames: [],
      collegeLogos: [],
      score: {
        score1: null,
        score2: null,
        score3: null,
        score4: null
      },
      bandName: null,
      i: null
    }
  },
  mounted() {
    // Get Band Names from DB
    this.getBandNames();

    // Get College Names from DB
    this.getCollegeNames();

    // Get College Logos from DB
    this.getCollegeLogos();

    // Modal Init
    $('.modal').modal();

    // Tooltip Init
    $('#btnClose').tooltip({delay: 30});
  },
  methods: {
    getBandNames() {
      axios.get('/api/band_names')
        .then(response => {
          this.bandNames = response.data;
          console.log(this.bandNames)
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
    getClickedBandName(bandName, i) {
      this.bandName = bandName;
      this.i = i;

      console.log(this.bandName + " this is the clicked band name " + this.i + " this is the clicked index")

      axios.get('/api/scores/' + this.bandName)
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
    saveScores() {
      console.log(this.bandName + " bandname " + this.collegeNames[this.i] + " college name")

      var params = new URLSearchParams()
      params.append('bandName', this.bandName)
      params.append('collegeName', this.collegeNames[this.i])
      params.append('score1', this.score.score1)
      params.append('score2', this.score.score2)
      params.append('score3', this.score.score3)
      params.append('score4', this.score.score4)

      axios.post('/api/submit', params, {headers: headers})
        .then(response => {
          console.log(response.data)
          Materialize.toast(response.data, 3000, "rounded")
        })
        .catch(e => {
          console.log(e)
          Materialize.toast("There's an error encountered while saving scores", 3000, "rounded")
        })
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

  #band {
    height: 74px; /* -6px */
  }

  #bandLogo {
    margin-top: 13px; /* -3px */
  }

  #band > .row > #cardSecondCol > #bandName {
    font-size: 14px;
    font-weight: bold;
    margin-top: 3px; /* -4px */
    padding: 3px 0;
  }

  #band > .row > #cardSecondCol > #collegeName {
    font-size: 10px;
    font-weight: 300;
    opacity: 0.7;
    line-height: 15px;
    margin-top: -60px;
  }

  #band > .row > #cardThirdCol > #aveScore {
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

  #modal1 > .modal-content > .s8 > #modalBandName {
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

<template>
  <div>
    <div class="center-align">
      <h2 class="white-text">The scores are submitted successfully!</h2>
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
      isUserLoggedIn: null
    }
  },
  created() {
    // Get judgeNumber then pass data
    this.judgeNumber = this.$route.params.judgeNumber;

    // Check user if logged in
    this.getUserLoggedIn();
  },
  methods: {
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
    updateUserLoggedInToFalse() {
      axios.post('/api/set_user_logged_in/' + false + '/' + this.judgeNumber, {headers: headers})
        .then(response => {
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        })
    }
  }
}
</script>

<style scoped>
</style>

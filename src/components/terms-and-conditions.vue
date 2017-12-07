<template>
  <div class="terms-container">
    <div class="modal-content">
      <div class="text" v-html="termsAndConditions">
      </div>
      <div class="buttons-container">
        <button @click="choiceSelected('Yes')" class="button accept">Accept</button>
        <button @click="choiceSelected('No')" class="button reject">Reject</button>
      </div>
    </div>
  </div>
</template>

<script>
  import collabAuthentication from 'mixins/createCollab.js'
  import termsAndConditions from 'assets/config_files/terms_and_conditions.md'
  export default {
    mixins: [collabAuthentication],
    data () {
      return {
        collabAuthentication,
        termsAndConditions
      }
    },
    methods: {
      choiceSelected (choice) {
        // from mixin collabAuthentication
        this.sendAcceptTerms(choice)
        if (choice === 'Yes') {
          /* eslint no-undef: 0 */
          let termsLocally = localStorage.getItem('bsp-terms-accepted')
          try {
            let parsed = JSON.parse(termsLocally) || []
            let ucName = this.$route.params.uc_name
            if (!parsed.includes(ucName)) {
              parsed.push(ucName)
              localStorage.setItem('bsp-terms-accepted', JSON.stringify(parsed))
            }
          } catch (e) {
            console.error('Error updating accepted terms locally')
          }
          // go to the page to create / add collabs
          this.$router.replace({
            path: `/${this.$route.params.list_usecases}/${this.$route.params.uc_name}`
          })
        } else {
          this.$router.go(-1)
        }
      }
    }
  }
</script>

<style scoped>
  .modal-content {
    margin: 40px;
    background-color: white;
    border-radius: 40px;
    padding: 60px;
    /*z-index: 1;*/
  }
  .terms-container {
    background-color: darkgray;
    height: 100%;
    width: 100%;
    position: absolute;
  }
  .buttons-container {
    display: flex;
    justify-content: space-evenly;
    margin-top: 50px;
  }
  .text {
    text-align: center;
    font-size: 20px;
  }
  .button {
    cursor: pointer;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
  }
  .button.accept {
    background-color: #4CAF50; /* Green */
  }
  .button.reject {
    background-color: #f44336; /* Green */
  }
</style>

<style>
  .terms-container h1 {
    margin-bottom: 50px;
  }
</style>
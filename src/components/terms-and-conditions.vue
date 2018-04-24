<template>
  <div class="terms-container">
    <div class="modal-custom-content">
      <div class="text" v-html="termsAndConditions">
      </div>
      <div class="buttons-custom-container">
        <button @click="choiceSelected('Yes')" class="custom-button accept">Accept</button>
        <button @click="choiceSelected('No')" class="custom-button reject">Reject</button>
      </div>
    </div>
  </div>
</template>

<script>
  import collabAuthentication from '@/mixins/createCollab.js'
  import termsAndConditions from '@/assets/config_files/terms_and_conditions.md'
  import storageManager from '@/mixins/storageManager.js'
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
          let category = this.$route.params.list_usecases
          storageManager.saveTermsAccept(category)
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
  .modal-custom-content {
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
  .buttons-custom-container {
    display: flex;
    justify-content: space-evenly;
    margin: 50px 0;
  }
  .text {
    text-align: center;
    font-size: 20px;
  }
  .custom-button {
    cursor: pointer;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
  }
  .custom-button.accept {
    background-color: #4CAF50; /* Green */
  }
  .custom-button.reject {
    background-color: #f44336; /* Green */
  }
</style>

<style>
  .terms-container h1 {
    margin-bottom: 50px;
  }
</style>
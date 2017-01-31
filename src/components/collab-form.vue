<template>
   <div class="collab-form">
      <md-whiteframe md-elevation="2">
         <md-tabs md-fixed md-elevation=2>

            <md-tab id="search" md-label="Search" md-icon="search" class="container-centered">
               <md-input-container>
                  <label>Collab Name</label>
                  <md-input placeholder="Search in your collabs"></md-input>
               </md-input-container>

               <md-button class="md-raised md-primary button-medium">Search</md-button>
            </md-tab>

            <md-tab id="create" md-label="Create"  md-icon="create" class="container-centered">
               <md-input-container>
                  <label>Collab Name</label>
                  <md-input placeholder="Create new collab"></md-input>
               </md-input-container>
               <md-switch v-model="private" id="priv_pub" name="priv_pub" class="md-primary"></md-switch>
               <span class="priv_pub">{{private_public}}</span>
            </md-tab>

         </md-tabs>     
      </md-whiteframe>
      
   </div>
</template>

<script>
   export default {
      name: 'collabForm',
      data () {
         return {
            private: false
         }
      },
      computed: {
         private_public () {
            if (this.private) {
               return 'Private'
            }
            return 'Public'
         }
      }
   }
</script>

<style>
   .container-centered {
      display: flex;
      -ms-flex-direction: column;
      flex-direction: column;
      -ms-flex-pack: center;
      align-items: center;
   }
   .collab-form {
      max-width: 600px;
      margin: auto;
   }
   .button-medium {
      max-width: 150px;
   }
   .collab-form .md-theme-default.md-tabs>.md-tabs-navigation {
      background-color: rgba(172, 96, 103, 0.95);
   }
   .collab-form .container-centered .md-theme-default.md-button.md-raised.button-medium {
      background-color: rgba(172, 96, 103, 0.95);
   }
   .priv_pub {
      font-size: 20px;
   }
</style>
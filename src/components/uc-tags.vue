<template>
   <div class="uc-tags">
      <b v-for="(exp, index) in uc.experience">
         <md-chip v-bind:class="classExp(exp)">{{ exp }}</md-chip>
      </b>
      <b v-if="uc.maturity" v-for="(mat, index) in uc.maturity">
         <div v-if="mat" v-bind:class="classMat(mat)"></div>
      </b>
      <b v-for="(access, index) in uc.access">
         <div v-if="access" v-bind:class="classAccess(access)"></div>
      </b>
   </div>
</template>

<script>
   export default {
      name: 'uc-tags',
      props: {
         uc: {
            type: Object,
            default () { return {} }
         }
      },
      methods: {
         classExp (exp) {
            return {
               'exp-end': exp === 'End',
               'exp-power': exp === 'Power',
               'exp-experts': exp === 'Experts',
               'exp-code': exp === 'Code'
            }
         },
         classMat (mat) {
            return {
               'mat-beta': mat === 'Beta',
               'mat-experimental': mat === 'Experimental'
            }
         },
         classAccess (access) {
            return {
               'access-hpc': access === 'HPC',
               'access-byor': access === 'BYOR'
            }
         }
      }
   }
</script>

<style>
.end {
   color: gray;
}
/* Experiences levels */
.md-chip.md-theme-default.exp-end {
   background-color: #CCFFCC;
}
.md-chip.md-theme-default.exp-power {
   background-color: #ffffb3;
}
.md-chip.md-theme-default.exp-experts {
   background-color: #f9cfa1;
}
.md-chip.md-theme-default.exp-code {
   background-color: #ebc3c3;
}
/* Maturity level */
.mat-beta {
   background-image: url('../assets/icons/Maturity_BETA_48x48.png');
   width: 48px;
   height: 48px;
}
.mat-experimental {
   background-image: url('../assets/icons/Maturity_EXP_48x48.png');
   width: 48px;
   height: 48px;
}
/* Access level */
.access-hpc {
   background-image: url('../assets/icons/Access_HPC_48x48.png');
   width: 48px;
   height: 48px;
}
.access-byor {
   background-image: url('../assets/icons/Access_BYO_48x48.png');
   width: 48px;
   height: 48px;
}
</style>
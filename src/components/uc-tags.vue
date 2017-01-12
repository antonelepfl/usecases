<template>
   <div class="uc-tags">
      <b v-for="(exp, index) in uc.experience">
         <md-chip v-bind:class="classExp(exp)">{{ exp }}</md-chip>
      </b>
      <b v-if="uc.maturity" v-for="(mat, index) in uc.maturity">
         <md-chip v-bind:class="classMat(mat)">{{ mat }}</md-chip>
      </b>
      <b v-for="(access, index) in uc.access">
         <md-chip v-if="access" v-bind:class="classAccess(access)">{{ access }}</md-chip>
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

.md-chip.md-theme-default.exp-end {
   background-color: blue;
}
.md-chip.md-theme-default.exp-power {
   background-color: palevioletred;
}
.md-chip.md-theme-default.exp-experts {
   background-color: palevioletred;
}
.md-chip.md-theme-default.exp-code {
   background-color: violet;
}

.md-chip.md-theme-default.mat-beta {
   background-color: yellow;
}
.md-chip.md-theme-default.mat-experimental {
   background-color: lightcoral;
}

.md-chip.md-theme-default.access-hpc {
   background-color: lightcoral;
}
.md-chip.md-theme-default.access-byor {
   background-color: lightgray;
}
.md-chip.md-theme-default.exp-end {
   background-color: red;
}
</style>
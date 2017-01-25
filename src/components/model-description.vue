<template>
      <div class="model-description" v-on:click="touched">
            <md-layout md-gutter>
                  <md-layout class="model-column" md-column md-flex-large="50">
                        <md-table v-once>
                              <md-table-header>
                                    <md-table-row>
                                          <md-table-head>Physiology:</md-table-head>
                                    </md-table-row>
                              </md-table-header>
                              <md-table-body>
                                    <md-table-row>
                                          <md-table-cell class="compact">Resting membrane potential:</md-table-cell>
                                          <md-table-cell class="">-71.263 mV</md-table-cell>
                                    </md-table-row>
                                    <md-table-row>
                                          <md-table-cell class="compact">Input resistance:</md-table-cell>
                                          <md-table-cell class="">57.288 MOhm</md-table-cell>
                                    </md-table-row>
                                    <md-table-row>
                                          <md-table-cell class="compact">Membrane time constant:</md-table-cell>
                                          <md-table-cell class="">29.076 ms</md-table-cell>
                                    </md-table-row>
                              </md-table-body>
                              </table>
                  </md-layout>

                  <md-layout class="model-column" md-column md-flex-large="50">
                     <md-table v-once>
                        <md-table-header>
                           <md-table-row>
                              <md-table-head>Channel Models:</md-table-head>
                           </md-table-row>
                        </md-table-header>
                        <md-table-body>
                           <md-table-row>
                              <md-table-cell class="">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo officia commodi
                                    esse fuga, expedita ullam, vel. Iure id quos assumenda totam, aliquam reiciendis
                                    modi, officiis cupiditate sequi in exercitationem aperiam!</md-table-cell>
                           </md-table-row>
                        </md-table-body>
                     </md-table>
                  </md-layout>
                  <md-layout class="model-column" md-column md-flex-large="100" md-flex-medium="100">
                     <div class="credits">
                        <b>Credits:</b>
                        <div>Created by: author@example.com</div>
                        <div>Reference: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nemo commodi esse fuga, expedita ullam, vel.</div>
                     </div>
                  </md-layout>
            </md-layout>
      </div>
</template>

<script>
   export default {
      name: 'modelDescription',
      props: {
         author: String
      },
      methods: {
         touched (event) {
            this.$emit('touched', event)
         }
      }
   }
</script>

<style>
.model-description .md-table-head-text.md-test {
   padding-left: 5px;
}
.model-description .md-table .md-table-cell .md-table-cell-container {
   padding-left: 5px;
   padding-right: 5px;
   text-align: left;
}
.md-table tbody .md-table-row:hover .md-table-cell {
   background-color: white;
}
.full {
    width: 100%;
}
.model-column {
   padding: 10px;
   text-align: justify;
   overflow: hidden;
}
</style>
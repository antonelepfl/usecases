<template>
      <div class="model-description">
            <md-layout md-gutter>
                  <md-layout class="model-column " md-column md-flex-large="33" md-flex-medium="50">
                        <md-table v-once>
                              <md-table-header>
                                    <md-table-row>
                                          <md-table-head>Anatomy</md-table-head>
                                    </md-table-row>
                              </md-table-header>
                              <md-table-body>
                                    <md-table-row>
                                          <md-table-cell class="compact">Soma diameter:</md-table-cell>
                                          <md-table-cell class="">8</md-table-cell>
                                    </md-table-row>

                                    <md-table-row>
                                          <md-table-cell class="compact">Axon maximum branch order:</md-table-cell>
                                          <md-table-cell>12</md-table-cell>
                                    </md-table-row>

                                    <md-table-row>
                                          <md-table-cell class="compact">Abical maximum branch order:</md-table-cell>
                                          <md-table-cell>12</md-table-cell>
                                    </md-table-row>

                                    <md-table-row>
                                          <md-table-cell class="compact">Basal maximum branch order:</md-table-cell>
                                          <md-table-cell>8</md-table-cell>
                                    </md-table-row>
                              </md-table-body>
                        </md-table>
                  </md-layout>

                  <md-layout class="model-column" md-column md-flex-large="33" md-flex-medium="50">
                        <md-table v-once>
                              <md-table-header>
                                    <md-table-row>
                                          <md-table-head>Physiology</md-table-head>
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

                  <md-layout class="model-column" md-column md-flex-large="33" md-flex-medium="100">
                        <md-table v-once>
                              <md-table-header>
                                    <md-table-row>
                                          <md-table-head>Channel Model:</md-table-head>
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
                        <md-table v-once>
                              <md-table-header>
                                    <md-table-row>
                                          <md-table-head>Credits:</md-table-head>
                                    </md-table-row>
                              </md-table-header>
                              <md-table-body>
                                    <md-table-row>
                                          <md-table-cell class="">Created By: Werner Van Geit (werner.vangeit@epfl.ch)</md-table-cell>
                                    </md-table-row>
                                    <md-table-row>
                                          <md-table-cell class="">
                                                <div>
                                                      Paper: Reconstruction and Simulation of Neocortical Microcircuitry. Cell  163:2, 456 - 492. 
                                                      <a href="http://www.cell.com/cell/abstract/S0092-8674%2815%2901191-5">doi: 10.1016/j.cell.2015.09.029</a>
                                                </div>
                                          </md-table-cell>
                                    </md-table-row>
                              </md-table-body>
                        </md-table>
                  </md-layout>
            </md-layout>
      </div>
</template>

<script>
      export default {
            name: 'modelDescription'
      }
</script>

<style>

.compact .md-table-cell-container {
   /*text-align: right;*/
}
.model-description .md-table-head-text.md-test {
      padding-left: 5px;
}
.model-description .md-table .md-table-cell .md-table-cell-container {
   padding-left: 5px;
   padding-right: 5px;
   text-align: left;
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
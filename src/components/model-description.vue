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
      padding-left: 0;
}
.model-description .md-table .md-table-cell .md-table-cell-container {
   padding-left: 0;
   padding-right: 0;
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
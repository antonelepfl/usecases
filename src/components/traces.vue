<template>
   <div class="traces">
      <h2>Trace</h2>
      <div hidden id="form"></div>
      <div id='infobox' class="panel-heading fn-container">
         <button class="selall btn btn-link btn-default">Select all</button>
         <button class="dselall btn btn-link btn-default">Deselect all</button>
         <button class="invsel btn btn-default btn-link">Invert selection</button>
      </div>
      <div id="container"></div>
      <navigation-buttons v-bind:prev='configroutes.modelconfig' v-bind:next='configroutes.home'></navigation-buttons>
   </div>
</template>
<script>
   import NavigationButtons from './navigation-buttons'
   import Plotly from 'plotly.js/lib/core'
   import configroutes from '../assets/routes.json'
   const SHOW_FADED = 0.15
   const SHOW_CHECK = 0.65
   const SHOW_HOVER = 1.0
   export default {
      name: 'traces',
      data () {
         return {
            traces: require('../assets/traces.json'),
            plotbox: null,
            infobox: null,
            formbox: null,
            tmp_appearance_hover: null,
            configroutes: configroutes
         }
      },
      components: {
         NavigationButtons
      },
      methods: {
         manageLegend () {
            var self = this
            var legend = Plotly.d3.select('#' + self.plotbox.id + ' g.legend')
            var elems = legend.selectAll('.traces rect')
            // Saves the value of the opacity before the mousehover
            function savePrevious (d) {
               if (d !== 0) {
                  var i = d[0].trace.index
                  self.tmp_appearance_hover = self.appearance[i]
                  self.appearance[i] = SHOW_HOVER
                  self.refresh()
               }
            }

            // Restores the value of the opacity after the mouseleave
            function restorePrevious (d) {
               if (d !== 0) {
                  var i = d[0].trace.index
                  self.appearance[i] = self.tmp_appearance_hover
                  self.refresh()
               }
            }

            // Allows to toggle the opacity of the specified trace
            function setOpacity (d) {
               if (d !== 0) {
                  var checkName = 'input[name="' + d[0].trace.name.slice(0, -3) + '"]'
                  if (self.tmp_appearance_hover === SHOW_FADED) {
                     self.formbox.querySelector(checkName).checked = true
                     self.tmp_appearance_hover = SHOW_CHECK
                  } else {
                     self.formbox.querySelector(checkName).checked = false
                     self.tmp_appearance_hover = SHOW_FADED
                  }
               }
            }

            // Binds the events to every element of the legend
            elems.each(function () {
               Plotly.d3.select(this).on('click', setOpacity)
               Plotly.d3.select(this).on('mouseenter', savePrevious)
               Plotly.d3.select(this).on('mouseleave', restorePrevious)
            })
         },
         plot () {
            // debugger
            var plotdata = []
            var traceObject = this.traces.traces
            var key = null
            var amp = this.traces.amp_unit
            for (key in traceObject) {
               var input = document.createElement('input')
               input.type = 'checkbox'
               input.name = key
               this.formbox.appendChild(input)
               // Defines what is about to be plotted
               var newTrace = {
                  y: traceObject[key],
                  name: key + ' ' + amp,
                  mode: 'lines',
                  hoverinfo: 'none',
                  opacity: SHOW_FADED
               }
               plotdata.push(newTrace)
            }

            // Sorts the traces names (mathematical order)
            plotdata.sort(function (a, b) {
               var a2 = parseFloat(a.name)
               var b2 = parseFloat(b.name)

               if (a2 === b2) {
                  return 0
               } else if (a2 < b2) {
                  return 1
               } else {
                  return -1
               }
            })

            var layout = {
               legend: {
                  orientation: 'h',
                  x: 0,
                  y: 1.2
               },
               margin: { l: 40, b: 60, t: 0 }
            }
            Plotly.newPlot('container', plotdata, layout, { displayModeBar: false }).then(this.manageLegend)
            this.refresh()
         },
         refresh () {
            var update = {
               opacity: this.appearance
            }
            Plotly.restyle(this.plotbox.id, update).then(this.manageLegend)
            // Sets the opacities of the legend's labels
            var legend = Plotly.d3.select('#' + this.plotbox.id + ' g.legend')
            legend.selectAll('.traces').each(function (d, i) {
                  Plotly.d3.select(this).style('opacity', update.opacity[i] + 0.4)
            })
         },
         bindEvents () {
            var self = this
            self.plotbox.addEventListener('plotly_relayout', function (ev) {
               self.refresh()
            })

            // Select every trace
            self.infobox.querySelector('.selall').addEventListener('click', function (ev) {
               self.appearance.fill(SHOW_CHECK)
               self.formbox.querySelector('input').checked = true
               self.refresh()
            })

            // Deselect all traces
            self.infobox.querySelector('.dselall').addEventListener('click', function (ev) {
               self.appearance.fill(SHOW_FADED)
               self.formbox.querySelector('input').checked = false
               self.refresh()
            })

            // Invers the selection
            self.infobox.querySelector('.invsel').addEventListener('click', function (ev) {
               for (var i = 0; i < self.appearance.length; i++) {
                  self.appearance[i] = self.appearance[i] === SHOW_FADED ? SHOW_CHECK : SHOW_FADED
                  var cb = self.formbox.querySelectorAll('input')[i]
                  cb.checked = !cb.checked
               }
               self.refresh()
            })
         }
      },
      mounted () {
            /* eslint no-unused-vars: 1 */
            this.plotbox = this.$el.querySelector('#container')
            this.infobox = this.$el.querySelector('#infobox')
            this.formbox = this.$el.querySelector('#form')
            var nTraces = Object.keys(this.traces.traces).length
            this.appearance = new Array(nTraces)
            this.appearance.fill(SHOW_FADED)
            this.bindEvents()
            this.plot()
      }
   }
</script>
<style>
   .traces {
      padding: 20px;
   }
</style>
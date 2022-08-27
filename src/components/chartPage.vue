<template>
  <Bar :chart-options="chartOptions" :chart-data="chartData" :chart-id="chartId" :dataset-id-key="datasetIdKey"
    :plugins="plugins()" :css-classes="cssClasses" :styles="styles()" :width="width" :height="height" />
</template>

<script setup >
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
const chartId = 'bar-chart'
const datasetIdKey = 'label'
const width = 400
const height = 400
const cssClasses = ''
const styles = () => { return {} }
const plugins = () => { return [] }
const p = defineProps({
  datas: Array,
  labels: Array
})
const chartData = {
  labels: p.labels,
  datasets: [{ data: p.datas }]
}
const chartOptions = {
  responsive: true
}

</script>

<style lang="sass" scoped>
.q-dialog__inner--minimized > div
  max-width: 800px
.q-form
  width: 800px
  background: white
  padding: 50px 30px 20px 40px
  tr
    min-height: 40px
  td:first-child
    font-size: 0.8rem
.q-select
  width: 300px
.q-input
  width: 300px
.q-rating
  margin-bottom: 0
.q-option-group
  display: flex
  flex-wrap: wrap
.ql-snow
  width: 600px
tr :deep(.editor)
  height: 200px
</style>

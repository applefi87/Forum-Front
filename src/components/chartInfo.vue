<!-- 統一格式  -->
<template>
  <q-card>
    <q-card-section>
      <div v-if="p.form.titleCol" class="text-h6 text-weight-bold">{{ p.form.titleCol }}: {{ p.form.title }}</div>
      <div v-if="p.form.score" class="text-weight-bold">{{ p.form.averageTitle }}: {{ p.form.score }}分</div>
    </q-card-section>
    <q-card-section v-if="p.form.datas" class="q-pt-none">
      <div v-if="p.form.chartTitle" class="text-h6 text-weight-bold text-center">{{ p.form.chartTitle }}</div>
      <apexchart type="pie" width="280" :options="options" :series="p.form.datas" class="q-pa-md">
      </apexchart>
    </q-card-section>
  </q-card>
</template>

<script setup >
import { createApp, defineComponent } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
defineComponent({
  apexchart: VueApexCharts
})

const app = createApp()
const p = defineProps({
  form: Object
})
const options = {
  bar: {
    horizontal: true
  },
  labels: ['0分', '1分', '2分', '3分', '4分', '5分'],
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 200
      },
      legend: {
        position: 'bottom'
      }
    }
  }],
  colors: ['#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5', '#2196f3']
}
</script>

<style lang="sass" scoped>
.q-card
  min-width:300px
</style>

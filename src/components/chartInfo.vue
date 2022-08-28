<!-- 統一格式  -->
<template>
  <q-card>
    <q-card-section>
      <div v-if="p.form.titleCol" class="text-h6 text-weight-bold">{{ p.form.titleCol }}: {{ p.form.title }}</div>
      <div v-if="p.form.score" class="text-weight-bold">{{ p.form.averageTitle }}: {{ p.form.score }}分</div>
    </q-card-section>
    <q-card-section v-if="p.form.datas" class="q-pt-none">
      <div v-if="p.form.chartTitle" class="text-h6 text-weight-bold text-center">{{ p.form.chartTitle }}</div>
      <vue3-chart-js v-bind="{ ...chartOptions }" class="q-pa-md"></vue3-chart-js>
    </q-card-section>
  </q-card>
</template>

<script setup >
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'

const p = defineProps({
  form: Object
})
const chartOptions = {
  type: 'pie',
  options: {
    min: 0,
    max: 1,
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },

    // scales: {
    //   y: {
    //     min: 0,
    //     max: p.form.amount,
    //     ticks: {
    //       callback: function (value) {
    //         return `${Math.floor(value * 100 / p.form.amount)}%`
    //       }
    //     }
    //   }
    // },
    animation: false
  },
  data: {
    labels: ['0分', '1分', '2分', '3分', '4分', '5分'],
    datasets: [
      {
        label: 'My First Dataset',
        backgroundColor: ['#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5', '#2196f3'],
        data: p.form.datas
      }
    ]
  }
}
</script>

<style lang="sass" scoped>
.q-card
  min-width:300px
</style>

<template>
  <boardPageVue v-if="hasChild" class="h100">
  </boardPageVue>
  <articlePageVue v-if="hasArticle" class="h100">
  </articlePageVue>
</template>

<script setup>
import { inject } from 'vue'
import articlePageVue from './articlePage.vue'
import boardPageVue from './boardPage.vue'

const hasChild = inject('hasChild')
const hasArticle = inject('hasArticle')
</script>

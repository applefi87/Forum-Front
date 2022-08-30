<template>
  <router-view />
</template>

<script setup>
import { ref, provide } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
const leftDrawerState = ref(true)
const rightDrawerState = ref(false)
const loginState = ref(false)

provide('leftDrawerState', leftDrawerState)
provide('rightDrawerState', rightDrawerState)
provide('loginState', loginState)
</script>

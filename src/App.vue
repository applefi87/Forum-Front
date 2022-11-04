<template>
  <router-view />
</template>

<script setup>
import { ref, provide, computed } from 'vue'
import { useUserStore } from 'src/stores/user'
const users = useUserStore()
const leftDrawerState = ref(true)
const rightDrawerState = ref(false)
const loginState = ref(false)
const langWord = computed(() => users.local.replace('-', ''))
provide('leftDrawerState', leftDrawerState)
provide('rightDrawerState', rightDrawerState)
provide('loginState', loginState)
provide('langWord', langWord)
</script>

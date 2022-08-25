<template >
  <q-layout view="hHh lpR fff" id="m">
    <q-header elevated class="bg-primary text-white">
      <headerPage :leftDrawerActive="leftDrawerActive"></headerPage>
    </q-header>
    <!-- ******************************************************** -->
    <q-drawer v-model='rightDrawerState' side="right" bordered :width="300" no-swipe-open no-swipe-close>
      <q-select v-model="locale" :options="localeOptions" label="Language:" borderless emit-value map-options />
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup>
import headerPage from 'components/Header/HeaderPage.vue'
import { ref, watch, inject } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useUserStore } from 'src/stores/user'
// import { useBoardStore } from 'src/stores/board'
import { useRouter } from 'vue-router'
const rightDrawerState = inject('rightDrawerState')
const users = useUserStore()
const leftDrawerActive = false
// *********************************************************************Header
// 增加多國語言可選+讀取預設語言
const publishArticleState = ref(false)
const localeOptions = [
  { value: 'en-US', label: 'English' },
  { value: 'zh-TW', label: '繁體中文' }
]
const { locale, t } = useI18n({ useScope: 'global' })
locale.value = users.local || useQuasar().lang.getLocale()
watch(locale, () => {
  users.local = locale.value
})

// *********************************************子文章************************
</script>
<style lang="sass" scoped >
.q-header
  height: 48px
.searchRows > .row
  margin-bottom: 30px
.q-drawer-container
  &:deep(.q-drawer)
    top: 48px
    width: 85% !important
    max-width: 300px
  &:deep(.q-drawer__backdrop)
    z-index: 1999 !important

</style>

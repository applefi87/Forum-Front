<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>
        <q-select v-model="locale" :options="localeOptions" label="Change Language" emit-value map-options
          style="min-width: 150px" />
        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>
          Essential Links
        </q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" :link="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup scoped>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
// 這為了可調整語言+預設語言
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
const localeOptions = [
  { value: 'en-US', label: 'English' },
  { value: 'zh-TW', label: '繁體中文' }
]
const { locale } = useI18n({ useScope: 'global' })
// 這段把預設語言設為偵測到電腦的語言
locale.value = useQuasar().lang.getLocale()
const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    test: 'message',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    test: 'thank',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    test: 'success',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    test: 'success',
    link: 'https://forum.quasar.dev'
  }
]
const leftDrawerOpen = ref(false)
const essentialLinks = linksList
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

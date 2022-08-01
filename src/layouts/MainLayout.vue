<template>
  <q-layout view="hHh LpR fff">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn class="lt-md" dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          Title
        </q-toolbar-title>

        <q-btn class="lt-md" dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model='leftDrawerState' side="left" mini-to-overlay persistent bordered show-if-above :breakpoint="1024"
      :width="300">
      <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          <div class="text-weight-bold">Razvan Stoenescu</div>
          <div>@rstoenescu</div>
        </div>
      </q-img>
    </q-drawer>

    <q-drawer v-model='rightDrawerState' side="right" mini-to-overlay persistent bordered show-if-above
      :breakpoint="1024" :width="300">
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          <div>Title</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerState = ref(false)
const rightDrawerState = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerState.value = !leftDrawerState.value
}

const toggleRightDrawer = () => {
  rightDrawerState.value = !rightDrawerState.value
}

</script>

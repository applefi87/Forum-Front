<template>
  <q-page class="flex flex-center">
    <p>{{ text }}</p>
    <img alt="Quasar logo" src="~assets/quasar-logo-vertical.svg" style="width: 200px; height: 200px">
    <p>{{ t('message') }}</p>
    <hr>
    <QuillEditor class="editor" toolbar="full" theme="bubble" v-model:content="text" contentType="html" />
    <!-- <button @click="send">send</button> -->
  </q-page>
</template>

<script setup>

import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
// 造型
import '@vueup/vue-quill/dist/vue-quill.bubble.css'

import { useI18n } from 'vue-i18n'
const { t } = useI18n() // call `useI18n`, and spread `t` from  `useI18n` returning
// return render context that included `t`

const text = ref('')
</script>

<style lang="sass">
.q-page
  background: #000
.editor
  width: 400px
  height: 300px
  border: 1px solid black
</style>

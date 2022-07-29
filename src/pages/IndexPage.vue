<template>
  <q-page class="flex flex-center">
    <p>{{ text }}</p>
    <img alt="Quasar logo" src="~assets/quasar-logo-vertical.svg" style="width: 200px; height: 200px">
    <p>{{ $t('message') }}</p>
    <QuillEditor class="editor" toolbar="full" theme="bubble" v-model:content="text" contentType="html" />
    <!-- <button @click="send">send</button> -->
  </q-page>
</template>

<script setup>

import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
// 造型
import '@vueup/vue-quill/dist/vue-quill.bubble.css'
const text = console.log(this)

</script>

<style lang="sass">
.editor
  width: 400px
  height: 300px
  border: 1px solid black
</style>

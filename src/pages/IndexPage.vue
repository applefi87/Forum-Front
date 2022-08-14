<template>
  <q-page class="flex flex-center">
    <p>{{ text }}</p>
    <img alt="Quasar logo" src="~assets/quasar-logo-vertical.svg" style="width: 200px; height: 200px">
    <p>{{ t('message') }}</p>
    <q-btn label="進入板塊" type="submit" color="primary" class="f-r" flat @click="testGetAllBoard" />
    <hr>
    <QuillEditor class="editor" toolbar="full" theme="bubble" v-model:content="text" contentType="html" />
    <!-- <button @click="send">send</button> -->
  </q-page>
</template>

<script setup>
import { api } from 'src/boot/axios'
import { ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
// 造型
import '@vueup/vue-quill/dist/vue-quill.bubble.css'

import { useI18n } from 'vue-i18n'
const { t } = useI18n() // call `useI18n`, and spread `t` from  `useI18n` returning
// return render context that included `t`
const text = ref('')
const testGetAllBoard = async () => {
  const { data } = await api.post('/board/62f60dea0e28c1a18208dac8', { t: 5 })
  console.log('ok')
  const boards = data.result
  console.log(boards.filter((b) => b.colData.c0 === '通識'))
}
</script>

<style lang="sass">
.q-page
  height: 500px
.editor
  width: 400px
  height: 300px
  border: 1px solid black
</style>

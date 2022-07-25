<template>
  <q-page class="flex flex-center">
    <p>{{ text }}</p>
    <img alt="Quasar logo" src="~assets/quasar-logo-vertical.svg" style="width: 200px; height: 200px">
    <p>{{ $t('success') }}</p>
    <QuillEditor class="editor" toolbar="full" theme="bubble" v-model:content="text" contentType="html" />
    <!-- <button @click="send">send</button> -->
  </q-page>
</template>

<script setup>

import { defineComponent, ref } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
// 造型
import '@vueup/vue-quill/dist/vue-quill.bubble.css'
// import nodemailer from 'nodemailer'
import sendMail from '../assets/sendMail'

// const send = () => {
//   console.log(process.env.Gmail_PWD)
// }

// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com',
//   port: 465,
//   auth: {
//     user: 'applefi87@gmail.com',
//     pass: 'process.env.Gmail_PWD'
//   }
// })

// transporter.sendMail({
//   from: 'applefi87@gmail.com',
//   to: 'werrtyyui@yahoo.com.tw',
//   subject: '測試喔',
//   html: 'wwww'
// }).then(info => {
//   console.log({ info })
// }).catch(console.error)
const text = ref('')
defineComponent({
  name: 'IndexPage',
  components: QuillEditor
}
)

</script>

<style lang="sass">
.editor
  width: 400px
  height: 300px
  border: 1px solid black
</style>

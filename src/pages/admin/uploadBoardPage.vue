<template>
  <q-page>
    <p> {{ t('uploadCSVHere') }}</p>
    <q-input filled v-model="uniqueCol" :label='t("semester")' lazy-rules :rules="uniqueColVal" />
    <q-file filled bottom-slots v-model="file" :label="t('boardCSVlist')" counter accept="text/csv"
      max-file-size="5242880" @rejected="onRejected">
      <template v-slot:prepend>
        <q-icon name="cloud_upload" @click.stop.prevent />
      </template>
      <template v-slot:hint>
        {{ t('csvMax5MB') }}
      </template>
    </q-file>
    <q-btn v-if="fileUploaded" color="primary" @click="transform" class="q-mt-md">{{ t('upload') }}</q-btn>
  </q-page>
</template>

<script setup>
import converter from 'json-2-csv'
import { apiAuth } from 'src/boot/axios'
import { useRoute } from 'vue-router'
import loading from 'src/utils/loading'
import { ref, watch } from 'vue'
import notify from 'src/utils/notify'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const route = useRoute()

const file = ref(null)
const onRejected = (file) => {
  console.log(file)
  notify({ title: t('csvMax5MB') })
}

const reader = new FileReader()

const uniqueCol = ref('')
const input = ref('')
const fileUploaded = ref(false)
watch(file, () => {
  fileUploaded.value = false
  // 代處理utf8/big5
  reader.readAsText(file.value, 'BIG5')
  reader.onload = () => {
    // 去除結尾多/r
    input.value = reader.result.replace(/[\r\n|\r|\n]$/, '')
    if (input.value) { fileUploaded.value = true } else { fileUploaded.value = false }
  }
})
const out = ref('')
const transform = () => {
  if (input.value) {
    console.log('in')
    converter.csv2json(
      input.value,
      async (err, json) => {
        let load
        try {
          load = loading({ title: 'Please wait,building.', delay: 100 })
          if (err) throw err
          const { data } = await apiAuth.post('/board/create/temp/' + route.params.id, { csv: json, uniqueCol: uniqueCol.value })
          notify({ success: data.success, ...data.message })
        } catch (error) {
          console.log(error)
          notify(...error.response.data.message)
        }
        load.hide()
      },
      { delimiter: { wrap: '"', eol: '\r' } }
    )
  }
}
const uniqueColVal = [
  val => (val !== null && val !== '') || '必填 學年-期 ex: 111-1',
  val => (val.length === 5 && val.match(/^\d{3}-[1-3]$/)) || '規格錯誤 ex: 111-1'
]

</script>

<style lang="sass" scoped>
.q-page
  padding:20px 10px 0 10px
.q-input
  max-width: 500px
.q-file
  max-width: 500px
</style>

<template>
  <q-page style="width:500px; margin:50px 10px 0 30px">
    <q-input filled v-model="uniqueCol" :label='t("semester")' lazy-rules :rules="uniqueColVal" />
    <q-file filled bottom-slots v-model="file" label="板塊清單" counter accept="text/csv" max-file-size="5242880"
      @rejected="onRejected">
      <template v-slot:prepend>
        <q-icon name="cloud_upload" @click.stop.prevent />
      </template>
      <template v-slot:hint>
        CSV檔，需小於5mb
      </template>
    </q-file>
    <button v-if="fileUploaded" @click="transform">transform</button>
  </q-page>
</template>

<script setup>
import converter from 'json-2-csv'
import { apiAuth } from 'src/boot/axios'
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import notify from 'src/utils/notify'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const route = useRoute()

const file = ref(null)
const onRejected = (file) => {
  console.log(file)
  notify({ title: '不能超過5MB,且必須為CSV檔' })
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
const transform = async () => {
  if (input.value) {
    console.log('in')
    converter.csv2json(
      input.value,
      async (err, json) => {
        if (err) throw err
        console.log(json[2])
        const { data } = await apiAuth.post('/board/create/temp/' + route.params.id, { csv: json, uniqueCol: uniqueCol.value })
        console.log('ok')
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

<style lang="sass">
.editor
  width: 400px
  height: 300px
  border: 1px solid black
</style>

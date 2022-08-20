<template>
  <q-page class="flex flex-center">
    <q-file filled bottom-slots v-model="file" label="板塊清單" counter accept="text/csv" max-file-size="5242880"
      @rejected="onRejected">
      <template v-slot:prepend>
        <q-icon name="cloud_upload" @click.stop.prevent />
      </template>
      <template v-slot:hint>
        CSV檔，需小於5mb
      </template>
    </q-file>

    {{ input }}
  </q-page>
</template>

<script setup>

import { ref, watch } from 'vue'
import notify from 'src/utils/notify'
import { useI18n } from 'vue-i18n'
const { t } = useI18n() // call `useI18n`, and spread `t` from  `useI18n` returning
// return render context that included `t`

const file = ref(null)
const onRejected = (file) => {
  console.log(file)
  notify({ title: '不能超過5MB,且必須為CSV檔' })
}

const reader = new FileReader()

const input = ref('')
watch(file, () => {
  // 代處理utf8/big5
  reader.readAsText(file.value, 'BIG5')
  reader.onload = () => {
    input.value = reader.result
  }
})

</script>

<style lang="sass">
.editor
  width: 400px
  height: 300px
  border: 1px solid black
</style>

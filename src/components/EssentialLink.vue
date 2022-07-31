<template>
  <q-item clickable tag="a" target="_blank" :href="link.link">
    <q-item-section v-if="link.icon" avatar>
      <q-icon :name="link.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ link.title }}</q-item-label>
      <q-item-label caption>{{ link.caption }}</q-item-label>
      <q-item-label>{{ t(link.test) }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import { useI18n } from 'vue-i18n'
const props = defineProps({
  link: Object
})
const { t } = useI18n()
const text = ref('')

</script>

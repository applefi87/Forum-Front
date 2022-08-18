<template >
  <q-dialog v-model="publishArticleState" persistent>
    <div>
      <q-form class="q-gutter-md" @submit.prevent="publish()">
        <q-input filled v-model="form.title" :label='category?.titleCol' hint='對課程簡短評價' :rules="titleVal">
        </q-input>
      </q-form>
    </div>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, inject, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from 'src/stores/user'
import notify from '../utils/notify'
const { t } = useI18n()
const users = useUserStore()
// 初始變數
const publishArticleState = inject('publishArticleState')
// 版有unique資料
const board = inject('board')
// 母版有能留言的規則
const articleRule = inject('articleRule')
const form = reactive({ c: 1, title: '', content: '' })
const category = computed(() => { return articleRule?.category?.find(it => it.c === form.c) })
// 目前新新增這幾樣
watch([articleRule, form.c], () => {
  // 有才新增不然移除
  if (form.c === 0) { form.score = 5 } else {
    delete form.score
  }
  if (category?.value?.tagActive) { form.tags = [''] } else {
    delete form.tags
  }
})

//
const titleVal = [
  val => (val && val.length >= 5 && val.length <= 30) || '長度需介於5~30字之間'
]
// ****************發布****
const publish = async () => {
  notify()
}

</script>

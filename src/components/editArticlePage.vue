<template >
  <q-dialog v-model="editArticleState" persistent v-if="categoryList.length > 0">
    <q-card v-if="category">
      <q-card-section class="row items-center q-pb-none">
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="scroll">
        <q-form class="q-gutter-md" ref="formRef">
          <!-- <h5>{{t('editing')+'"'+ ((category.c === 1)? t('review'):category.n[langWord.value])+'"'+t('your articles')}} -->
          <!-- </h5> -->
          <h6>
            {{ uniqueInfo }}
          </h6>
          <table>
            <tr>
              <td>{{ t('privacy') }}</td>
              <td>
                <q-select outlined v-model="privacy" :options="privacyList" dense options-dense
                  :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'" :rules="mustSelectVal" />
              </td>
            </tr>
            <!-- 評分 -->
            <tr v-if="category && category.c === 1">
              <td>{{ t('rate') }}</td>
              <td>
                <q-rating v-model="editArticleContent.score" size="2em" color="grey" color-selected="yellow" :max="5" />
              </td>
            </tr>
            <!-- tag -->
            <tr v-if="category.tagOption">
              <td>{{ t('tags') }}</td>
              <td>
                <!-- <q-option-group :options="category.tagOption.map(o => { return { label: o[langWord], value: o.c } })" -->
                <q-option-group
                  :options="Object.keys(category.tagOption).map(k => { return { label: category.tagOption[k][langWord], value: k } })"
                  type="checkbox" v-model="editArticleContent.tags" />
              </td>
            </tr>
            <!-- 標題 -->
            <tr>
              <td>{{ t('title') }}</td>
              <td>
                <q-input v-model="editArticleContent.title" :rules="titleVal">
                </q-input>
              </td>
            </tr>
            <!-- 其他col -->
            <!-- <tr v-for="col in (category.cols?.length > 0 ? category.cols : [])" :key="col">
            <td>{{ t(col.n) }}</td>
            <td>
              <q-input v-model="form.cols[col.n]" placeholder="選填">
              </q-input>
            </td>
          </tr> -->
            <!-- content(放最後) ****************************-->
            <tr>
              <td style="vertical-align:text-top ; padding-top: 30px">{{
                  category.contentCol[langWord]
              }}</td>
              <td style=" padding-top: 20px">
                <QuillEditor class="editor" toolbar="essential" theme="snow"
                  v-model:content="editArticleContent.content" ref="quill" contentType="html" />
              </td>
            </tr>
          </table>
        </q-form>
      </q-card-section>
      <q-card-section class="row items-center q-pb-none" style="padding:5px">
        <q-btn :label="t('submit')" @click="update()" color="primary" :loading="updating"></q-btn>
        <q-btn :label="t('close')" flat class="q-ml-sm close-register" @click="editArticleState = false" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup >
import repNotify from 'src/utils/repNotify'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { ref, reactive, inject, watch, computed } from 'vue'
import notify from 'src/utils/notify'
import { useI18n } from 'vue-i18n'
import { apiAuth } from 'src/boot/axios'
import { useRoute, useRouter } from 'vue-router'
import { titleVal, mustSelectVal } from 'src/utils/data/valList.js'
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

// import { useArticleStore } from 'src/stores/article'
// const articles = useArticleStore()
// 初始變數
const langWord = inject('langWord')
const editArticleState = inject('editArticleState')
const editArticleContent = inject('editArticleContent')
// 版有unique資料
const board = inject('board')
// 母版有能留言的規則
const articleRule = inject('articleRule')
// ************************************************************
const formRef = ref(null)
const quill = ref(null)
// 選單用特殊格式******
const privacyList = computed(() => { return [{ label: t('showAll'), value: 1 }, { label: t('anonymous'), value: 0 }] })
const privacy = ref({})
// 文章分類也是
const category = computed(() => categoryList.find(c => c.c === editArticleContent?.category))
const categoryList = reactive([])
// 獨立選單建立*********
const uniqueInfo = computed(() => {
  const u = board.uniqueData.find(u => u._id === editArticleContent.uniqueId)
  return (t('semester') + ':' + (u.c80 || t('none')) + ',' + t('time') + ':' + (u.c85[0] || t('none')) + ',' + t('location') + ':' + (u.c85[1] || t('none')))
})
// *********************
// form 基礎object建立(依照article),並填上原先值
const init = () => {
  // console.log('init adit')
  // 用if因為子元件先跑完母元件才post 重仔頁面會有一段時間沒資料報錯, 要有值才使賦值
  if (articleRule?.category?.length > 0) {
    categoryList.length = 0
    categoryList.push(...articleRule.category)
    if (editArticleContent?.privacy !== undefined) {
      privacy.value.value = editArticleContent.privacy
      privacy.value.label = privacyList.value.find(p => p.value === editArticleContent.privacy).label
      // if (f.cols?.length > 0) {
      //   form.cols = {}
      //   for (const col of f.cols) {
      //     form.cols[col.n] = ''
      //   }
      //   form.tags = editArticleContent.tags
      // }
    }
  }
}
// 當開啟編輯文章介面再更新介面
watch(editArticleState, () => {
  if (editArticleState.value === true) {
    init()
  }
})

// ****************發布****
const updating = ref(false)
const update = () => {
  formRef.value.validate().then(async success => {
    if (!success) return notify({ title: '請檢查欄位' })
    if (quill.value.getText().length < 10 || quill.value.getText().length > 3000) return notify({ title: t('articleContentLengthErr') })
    //
    if (route.params.id) {
      updating.value = true
      try {
        editArticleContent.privacy = privacy.value.value
        // console.log(editArticleContent)
        const { data } = await apiAuth.post('/article/edit/' + route.params.id, editArticleContent)
        repNotify(data)
        editArticleState.value = false
        // 自動重整才能看到評分
        router.go()
      } catch (error) {
        // console.log(error.response.data)
        repNotify(error.response.data)
      }
      updating.value = false
    }
  })
}
</script>

<style lang="sass" scoped>
.q-dialog__inner--minimized > div
  max-width: 800px
  width: 98%
  overflow-x: hidden
.q-card
  overflow: hidden
  &:deep(.q-card__section)
    background: white
    background: white
table
  width: 100%
td:first-child
  width: 50px
.q-form
  width: 100%
  background: white
  padding: 0
  tr
    min-height: 40px
  td:first-child
    font-size: 0.8rem
  td:last-child
    width: 60vw
    max-width: 600px
.q-select
  width: 300px
.q-input
  width: 300px
.q-rating
  margin-bottom: 0
.q-option-group
  display: flex
  flex-wrap: wrap
.ql-snow
  width: 600px
tr:deep(.editor)
  min-height: 200px

.scroll
  max-height: 80vh
</style>

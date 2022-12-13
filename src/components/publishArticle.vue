<template >
  <q-dialog v-model="publishArticleState" persistent v-if="categoryList.length > 0">
    <q-card v-if="category" style="position:relative;">
      <q-card-section class="row items-center q-pb-none">
        <q-space />
        <q-btn icon=" close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="scroll">
        <q-form ref="formRef">
          <table>
            <tr>
              <td>{{ t('privacy') }}</td>
              <td>
                <q-select outlined v-model="privacy" :options="privacyList" dense options-dense
                  :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'" :rules="mustSelectVal" />
              </td>
            </tr>
            <tr>
              <td>{{ t('articleCategory') }}</td>
              <td>
                <q-select outlined v-model="selectCat" :options="categoryCodeList" dense options-dense
                  :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'" :rules="mustSelectVal" />
              </td>
            </tr>
            <tr>
              <td>{{ parent.childBoard.rule.transformTable.c80[langWord] }}</td>
              <td>
                <q-select v-if="uniqueList?.length > 0" outlined v-model="unique" :options="uniqueList" dense
                  options-dense :behavior="$q.platform.is.ios === true ? 'dialog' : 'menu'" :rules="mustSelectVal" />
              </td>
            </tr>
            <!-- 評分 -->
            <tr v-if="category && category.c === 1">
              <td>{{ t('rate') }}</td>
              <td>
                <q-rating v-model="form.f1.score" size="2em" color="grey" color-selected="yellow" :max="5" />
              </td>
            </tr>
            <!-- tag -->
            <tr v-if="category.tagOption">
              <td>{{ t('tags') }}</td>
              <td>
                <!-- <q-option-group :options="category.tagOption.map(o => { return { label: o[langWord], value: o.c } })" -->
                <q-option-group
                  :options="Object.keys(category.tagOption).map(k => { return { label: category.tagOption[k][langWord], value: k } })"
                  type="checkbox" v-model="form['f' + selectCat.value].tags" />
              </td>
            </tr>
            <!-- 標題 -->
            <tr>
              <td>{{ t('title') }}</td>
              <td>
                <q-input v-model="form['f' + selectCat.value].title" :rules="titleVal">
                </q-input>
              </td>
            </tr>
            <!-- 其他col -->
            <!-- <tr v-for="col in (category.cols?.length > 0 ? category.cols : [])" :key="col">
            <td>{{ t(col.n) }}</td>
            <td>
              <q-input v-model="form['f' + selectCat.value].cols[col.n]" placeholder="選填">
              </q-input>
            </td>
          </tr> -->
            <!-- content(放最後) ****************************-->
            <tr>
              <td style="vertical-align:text-top ; padding-top: 30px">{{
                  category.contentCol[langWord]
              }}</td>
              <td style=" padding-top: 20px">
                <QuillEditor class="editor" toolbar="essential" theme="snow" ref="quill"
                  v-model:content="form['f' + selectCat.value].content" contentType="html" />
              </td>
            </tr>
          </table>

        </q-form>
      </q-card-section>
      <q-card-section class="row items-center q-pb-none" style="padding:5px ">
        <q-btn :label="t('submit')" @click.prevent="publish()" color="primary" :loading="publishing" class="q-ma-sm">
        </q-btn>
        <q-btn :label="t('close')" flat class="q-ma-sm close-register" @click.prevent="publishArticleState = false" />
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
const publishArticleState = inject('publishArticleState')
// 版有unique資料
const board = inject('board')
// 母版有能留言的規則
const parent = inject('parent')
// ************************************************************

// 有3個板，就產生3個表單 totalForm.f1 2 3
// 用for 建置 加上讀取規則自動產生
// 如果換版>watch，把原本全清除for[key]，重新建
const form = reactive({})
const formRef = ref(null)
const quill = ref(null)
// const uniqueList = reactive([])
const selectCat = ref(null)
const privacyList = computed(() => { return [{ label: t('showAll'), value: 1 }, { label: t('anonymous'), value: 0 }] })
const privacy = ref({})
// 先抓取文章分類+設個預設的
const categoryList = reactive([])
const categoryCodeList = computed(() =>
  parent?.childBoard?.article?.category?.map(c => {
    if (c.c === 1) {
      return { label: t('review'), value: 1 }
    } else {
      return { label: c.n[langWord.value], value: c.c }
    }
  })
)
// ***************給vue元件用 不用重複算
const category = computed(() => categoryList.find(c => {
  return c.c === selectCat?.value?.value
}))
// 獨立選單建立
const unique = ref('')
const uniqueList = computed(() => {
  if (board?.uniqueData?.length > 0) {
    return board.uniqueData.map(u => {
      return {
        label: parent.childBoard.rule.transformTable.c80[langWord.value] + ':' + (u.c80 || t('none')) + ',' + parent.childBoard.rule.transformTable.c85[langWord.value] + ':' + ((u.c85 && u.c85 !== '無') ? u.c85 : t('none')) + ',' + parent.childBoard.rule.transformTable.c90[langWord.value] + ':' + ((u.c90 && u.c90 !== '無') ? u.c90 : t('none')),
        value: u._id
      }
    })
  }
  return []
})

// form 基礎欄位建立(依照article)
const init = () => {
  // 用if因為子元件先跑完母元件才post 重仔頁面會有一段時間沒資料報錯, 要有值才使賦值
  if (parent?.childBoard?.article?.category?.length > 0) {
    categoryList.length = 0
    categoryList.push(...parent?.childBoard?.article.category)
    // 對應加上form.fx
    categoryList?.forEach(f => {
      form['f' + f.c] = { title: '', content: f.contentTemplate[0] || '' }
      const formIn = form['f' + f.c]
      if (f.c === 1) formIn.score = 5
      if (f.tagActive) {
        formIn.tags = []
      }
      if (f.cols?.length > 0) {
        formIn.cols = {}
        for (const col of f.cols) {
          formIn.cols[col.n] = ''
        }
        formIn.tags = []
      }
    })
    privacy.value.value = privacyList.value[0].value
    privacy.value.label = privacyList.value[0].label
    // 預設第一個
    selectCat.value = categoryCodeList.value[0]
  }
}
// 當開啟編輯文章介面再更新介面
watch(publishArticleState, () => {
  if (publishArticleState.value === true) {
    init()
  }
})
//

// ****************發布****
const publishing = ref(false)
const publish = () => {
  formRef.value.validate().then(async success => {
    if (!success) return notify({ title: '請檢查欄位' })
    if (quill.value.getText().length < 10 || quill.value.getText().length > 3000) return notify({ title: t('articleContentLengthErr') })
    //
    if (route.params.id) {
      publishing.value = true
      try {
        const submit = JSON.parse(JSON.stringify(form['f' + selectCat.value.value]))
        submit.privacy = privacy.value.value
        submit.category = selectCat.value.value
        submit.uniqueId = unique.value.value
        const { data } = await apiAuth.post('/article/create/' + route.params.id, submit)
        repNotify(data)
        // console.log(data.result)
        publishArticleState.value = false
        // 自動重整才能看到評分
        window.location.reload()
      } catch (error) {
        // console.log(error.response.data)
        repNotify(error.response.data)
      }
      publishing.value = false
    }
  })
}
</script>

<style lang="sass" scoped>
.q-dialog__inner--minimized>div
    max-width: 800px
    width: 98%
    overflow-x: hidden
.q-card
  overflow: hidden
  &:deep(.q-card__section)
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

<template >
  <q-dialog v-model="viewArticleState" persistent v-if="categoryList.length > 0">
    <div v-if="article">
      <q-form class="q-gutter-md" ref="formRef">
        <table>
          <!-- 個人資訊 -->
          <tr>
            <img :src="'https://source.boringavatars.com/beam/30/' + (article.user.nickName||'you')">
            <b> {{ article.user.nickName === 'originalPoster' ? t('originalPoster') :(article.user.nickName ===
            'you'||article.user.nickName ===undefined)
            ? t('you'):(article.user.nickName || t('anonymous')) }}</b>
            <td>
              <chartInfo :form="userInfoForm" class="userChart" />
            </td>
          </tr>
          <!-- 標題 -->
          <tr>
            <td>{{ t('title') }}</td>
            <td>
              {{article.title}}
            </td>
          </tr>
          <!-- 評分 -->
          <tr v-if="article.category === 1">
            <td>{{ t('rate') }}</td>
            <td>
              <q-rating v-model="article.score" size="1.5em" color="grey" color-selected="warning" readonly />
            </td>
          </tr>
          <!-- tag -->
          <tr v-if="article.tags?.length>0">
            <td>{{ t('tags') }}</td>
            <td>
              <p class="tag" v-for="t in (article.tags )" :tag="t" :key="t">
                {{ parent.childBoard.article.category[0].tagOption
                [t][langWord] }}
              </p>
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
            category.contentCol[langWord] }}</td>
            <td style=" padding-top: 20px">
              <div class="htmlContent" v-html="article.content"></div>
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <q-btn :label="t('submit')" @click="publish()" color="primary" :loading="publishing"></q-btn>
              <q-btn :label="t('close')" flat class="q-ml-sm close-register" @click="viewArticleState = false" />
            </td>
          </tr>
        </table>
      </q-form>
      <messageDialog />
    </div>
  </q-dialog>
</template>

<script setup >
import notify from 'src/utils/notify'
import repNotify from 'src/utils/repNotify'
import chartInfo from 'components/chartInfo.vue'
import messageDialog from 'components/messageDialog.vue'
import { ref, reactive, inject, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { apiAuth } from 'src/boot/axios'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const { t } = useI18n()

// import { useArticleStore } from 'src/stores/article'
// const articles = useArticleStore()
// 初始變數
const langWord = inject('langWord')
const viewArticleState = inject('viewArticleState')
const parent = inject('parent')
const article = inject('article')
const articleRule = inject('articleRule')
const board = inject('board')
const userInfoState = inject('userInfoState')
const userInfoForm = inject('userInfoForm')
// ************************************************************

// 有3個板，就產生3個表單 totalForm.f1 2 3
// 用for 建置 加上讀取規則自動產生
// 如果換版>watch，把原本全清除for[key]，重新建
const form = reactive({})
const formRef = ref(null)
// const uniqueList = reactive([])
const selectCat = ref(null)
const privacyList = computed(() => { return [{ label: t('showAll'), value: 1 }, { label: t('anonymous'), value: 0 }] })
const privacy = ref({})
// 先抓取文章分類+設個預設的
const categoryList = reactive([])
const categoryCodeList = computed(() =>
  articleRule?.category?.map(c => {
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
        label: t('semester') + ':' + (u.c80 || t('none')) + ',' + t('time') + ':' + ((u.c85[0] && u.c85[0] !== '無') ? u.c85[0] : t('none')) + ',' + t('location') + ':' + ((u.c85[1] && u.c85[1] !== '無') ? u.c85[1] : t('none')), value: u._id
      }
    })
  }
  return []
})

// form 基礎欄位建立(依照article)
const init = () => {
  // 用if因為子元件先跑完母元件才post 重仔頁面會有一段時間沒資料報錯, 要有值才使賦值
  if (articleRule?.category?.length > 0) {
    categoryList.length = 0
    categoryList.push(...articleRule.category)
    // 對應加上form.fx
    categoryList?.forEach(f => {
      form['f' + f.c] = { title: '', content: '' }
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
watch(viewArticleState, () => {
  if (viewArticleState.value === true) {
    init()
  }
})

// ****************發布****
const publishing = ref(false)
const publish = () => {
  formRef.value.validate().then(async success => {
    if (!success) return notify({ title: '請檢查欄位' })
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
        console.log(data.result)
        viewArticleState.value = false
        // 自動重整才能看到評分
        router.go()
      } catch (error) {
        console.log(error.response.data)
        repNotify(error.response.data)
      }
      publishing.value = false
    }
  })
}
</script>

<style lang="sass" scoped>
.tag
  display: inline-block
  width: 30px
  margin: 0 2px
  text-align: center
  color: white
  background: green
  border-radius: 50px
.q-dialog__inner--minimized > div
  max-width: 800px
  overflow-x: hidden
.q-form
  width: 800px
  background: white
  padding: 50px 30px 20px 40px
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
  height: 200px
.editor
  width: 100%
.htmlContent
  text-align: left
  text-overflow: ellipsis
  &:deep(*)
    margin: 0
    word-wrap: break-word
.cellBTN
  height: 100%
  background: transparent
  border: none
  cursor: pointer
.userChart
  width: 200px
  min-width: 0
</style>

<template >
  <q-dialog v-model="viewArticleState" v-if="categoryList.length > 0">
    <div v-if="article" class="content">
      <table>
        <!-- 個人資訊 -->
        <tr>
          <td> <img :src="'https://source.boringavatars.com/beam/30/' + (article.user.nickName || 'you')"><br>
          </td>
          <td>
            <b> {{ article.user.nickName === 'owner' ? t('owner') : article.user.nickName === 'you' ? t('you') :
                article.user.nickName === 'youHide' ? t('youHide') : (article.user.nickName || t('anonymous'))
            }}</b>
          </td>
        </tr>
        <!-- 標題 -->
        <tr>
          <td>{{ t('title') }}</td>
          <td>
            {{ article.title }}
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
        <tr v-if="article.tags?.length > 0">
          <td>{{ t('tags') }}</td>
          <td>
            <p class="tag" v-for="t in (article.tags)" :tag="t" :key="t">
              {{ parent.childBoard.article.category[0].tagOption
                [t][langWord]
              }}
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
              category.contentCol[langWord]
          }}</td>
          <td style=" padding-top: 20px">
            <div class="htmlContent" v-html="article.content"></div>
          </td>
        </tr>
      </table>
      <q-card id="msg" style="max-width: 100%;">
        <!-- <q-card-section class="q-pb-none">
      title
    </q-card-section> -->
        <q-card-section v-if="articleMsg.datas.length > 0" class="q-pa-none" style="max-height:30vh;overflow-y:auto;">
          <!-- <q-table :rows="p.form.datas" :columns="columns" row-key="id" virtual-scroll=true separator="none" hide-header
        flat hide-pagination>
        <template v-slot:body="props">
          <q-tr :props="props" auto-width no-hover>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <button v-if="col.name === 'user'" class="cellBTN"
                @click="showUserInfo(col.value, props.row.user.record.toBoard.score, props.row.user.record.toBoard.amount, props.row.user.record.toBoard.scoreChart)">
                {{ col.value || t('anonymous') }}
              </button>
              <div v-else-if="col.name === 'content'"
                style="text-align: left; display:flex;justify-content: space-between; height:100%">
                <div v-html="col.value"></div>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table> -->
          <q-list ref="msgBox">
            <q-item v-for="msg in articleMsg.datas" :key="msg.createdAt">
              <q-item-section avatar v-if="msg.state === 1">
                <q-avatar rounded>
                  <q-icon v-if="msg.user.nickName === 'owner'" name="home" />
                  <img v-else
                    :src="'https://source.boringavatars.com/beam/120/' + (msg.user.nickName === 'youHide' ? 'you' : (msg.user.nickName || 'you'))">
                </q-avatar>
              </q-item-section>
              <q-item-section v-if="editingId !== msg.id && msg.state === 1" class="msgContent">
                <b>
                  {{ msg.user.nickName === 'owner' ? t('owner') : (msg.user.nickName === 'you' || (msg.user.nickName
                      === undefined && msg.privacy === 1)) ? t('you') : (msg.user.nickName === 'youHide' ||
                        (msg.user.nickName === undefined && msg.privacy === 0)) ? t('youHide') : (msg.user.nickName ||
                          t('anonymous'))
                  }}
                </b>
                {{ msg.content }}
              </q-item-section>
              <q-item-section v-if="msg.state === 0">
                <div class="q-ml-lg">{{ t('articleBanned') }}</div>
              </q-item-section>
              <div v-if="msg.state === 1">
                <div v-if="editingId !== msg.id">
                  <q-btn v-if="msg.owner" square color="primary" flat icon="edit" style="height:100% "
                    @click="editMsg(msg.id, msg.content, msg.privacy)">
                  </q-btn>
                  <q-btn v-if="msg.owner" square color="red" flat icon="delete" style="height:100% "
                    @click="deleteMsg(msg.id)">
                  </q-btn>
                  <q-btn v-if="users.role === 0" square color="red" flat icon="cancel" style="height:100% "
                    @click="banMsg(msg.id)">
                  </q-btn>
                </div>
                <div v-else class="editArea">
                  <q-input style="width:100%" filled v-model="editContent.content" dense @keydown.enter="updateMsg()">
                    <template v-slot:after>
                      <q-btn @click="updateMsg" round dense flat icon="send" />
                    </template>
                  </q-input>
                  <q-btn square color="red" flat icon="cancel" style="height:100% " @click="cancelEdit()">
                  </q-btn>
                </div>
              </div>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-section v-else>{{ t('writeAComment') }}
        </q-card-section>
      </q-card>
      <div class="q-pt-none msgInput">
        <q-select v-if="!articleMsg.isSelf" borderless v-model="msgForm.privacy" :options="privacyOptions" dense
          style="width:150px">
          <template v-slot:before>
            <p style="font-size: 0.8rem;color: black; margin: 0"> {{ t('privacy') }}:</p>
          </template>
        </q-select>
        <q-input filled v-model="msgForm.content" :placeholder="t('writeAComment')" dense
          @keydown.enter="users.loginState ? sendMsg() : loginState = true" type="textarea">
          <template v-slot:after>
            <q-btn v-if="users.loginState" @click="sendMsg" round dense flat icon="send" :loading="sendingMsg" />
            <q-btn v-else @click="loginState = true" round dense flat icon="send" />
          </template>
        </q-input>
      </div>
    </div>
  </q-dialog>
</template>

<script setup >
import { useUserStore } from 'src/stores/user'
import { ref, reactive, inject, watch, computed, nextTick } from 'vue'
import { apiAuth } from 'src/boot/axios'
import notify from 'src/utils/notify'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
// 初始變數
const langWord = inject('langWord')
const viewArticleState = inject('viewArticleState')
const parent = inject('parent')
const article = inject('article')
const articleRule = inject('articleRule')
// ************************************************************
// 有3個板，就產生3個表單 totalForm.f1 2 3
// 用for 建置 加上讀取規則自動產生
// 如果換版>watch，把原本全清除for[key]，重新建
const form = reactive({})
const selectCat = ref(null)
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

// 留言區*****************************

const msgBox = ref(null)
const loginState = inject('loginState')
const articleMsg = inject('articleMsg')
const articles = inject('articles')
const editingId = ref(undefined)
const editContent = reactive({ privacy: 0, content: '' })
// const p = defineProps({
//   article: Object
// })
const e = defineEmits(['update:article'])
const users = useUserStore()
const privacyOptions = computed(() => {
  return [
    { label: t('anonymous'), value: 0 },
    { label: t('showAll'), value: 1 }
  ]
})
// 請預設給匿名，這樣匿名發文者不用選，就會是匿名id
const msgForm = reactive({ content: '', privacy: privacyOptions.value[0] })
const sendingMsg = ref(false)
const sendMsg = async function () {
  if (msgForm.content === '') return
  sendingMsg.value = true
  const submit = { content: msgForm.content, privacy: msgForm.privacy.value }
  try {
    const { data } = await apiAuth.post('/article/msg/create/' + articleMsg._id, submit)
    articleMsg.datas = data.result.msg1.list
    notify({ title: t('msgSended'), success: true })
    const idx = articles.findIndex(it => it._id === articleMsg._id)
    if (idx >= 0) {
      // console.log(article)
      articles[idx] = data.result
    }
    msgForm.content = ''
    // nextTick(() => {
    //   msgBox.value.$el.scrollIntoView(false, { behavior: 'smooth' })
    // })
  } catch (error) {
    console.log(error)
  }
  sendingMsg.value = false
}

const deleteMsg = async function (msgId) {
  try {
    const { data } = await apiAuth.post('/article/msg/delete/' + articleMsg._id, { id: msgId })
    if (data.success) {
      const articleIdx = articleMsg.datas.findIndex(it => it.id === msgId)
      articleMsg.datas.splice(articleIdx, 1)
    }
  } catch (error) {
    console.log(error)
  }
}
const banMsg = async function (msgId) {
  try {
    const { data } = await apiAuth.post('/article/msg/ban/' + articleMsg._id, { id: msgId })
    if (data.success) {
      articleMsg.datas[articleMsg.datas.findIndex(it => it.id === msgId)].state = 0
    }
  } catch (error) {
    console.log(error)
  }
}
const editMsg = async function (msgId, msg, privacy) {
  editContent.content = msg
  // editContent.privacy = privacy
  editingId.value = msgId
}
const updateMsg = async function () {
  if (editContent.content === '') return
  const submit = { id: editingId.value, content: editContent.content }
  try {
    const { data } = await apiAuth.post('/article/msg/edit/' + articleMsg._id, submit)
    if (data.success) {
      articleMsg.datas[articleMsg.datas.findIndex(it => it.id === editingId.value)].content = editContent.content
      cancelEdit()
    }
  } catch (error) {
    console.log(error)
  }
}
const cancelEdit = () => {
  editContent.content = ''
  editingId.value = ''
  editingId.value = undefined
}
</script>

<style lang="sass" scoped>
.content
  width: 800px
  display: relative
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
table
  width: 100%
  background: white
  padding: 30px 30px 20px 30px
  border-bottom: 3px solid #888
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
//*********留言區
.q-btn
  padding: 0 5px
.q-card
  min-width: 300px
  .q-list
    padding-top: 10px
  #msg td
    height: auto
    min-height: 50px
    margin-bottom: 20px
  td:first-child
    width: 50px
    padding: 0
  td:last-child
    border-radius: 15px
    padding: 5px
    background: #ccc
  .editArea
    display: flex
    width:100%
  .msgContent
    display: inline-block
    max-width: 100%
    word-wrap: break-all
    overflow: hidden
    text-overflow: ellipsis
.msgInput
  background: #fff
  border-top: 1px solid #999
  padding: 5px 20px
  position: sticky
  bottom: 0

</style>

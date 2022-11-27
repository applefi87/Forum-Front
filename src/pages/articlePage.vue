<template>
  <q-page class="flex flex-center" v-if="articles.length > 0" style="height:100%">
    <q-table :rows="articles" :columns="columns" row-key="_id" :virtual-scroll="pagination.rowsPerPage === 0"
      v-model:pagination="pagination" :no-data-label="t('noFound')" :rows-per-page-options="[10, 20, 40, 80]"
      separator="none">
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols.filter(d => d.name !== 'content')" :key="col.name" :props="props" auto-width>
            {{ col.label }}
          </q-th>
          <q-th v-for="col in props.cols.filter(d => d.name === 'content')" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" v-if="props.row.state != 0">
          <q-td v-for="col in props.cols.filter(d => d.name !== 'content')" :key="col.name" :props="props" auto-width>
            <div v-if="col.name === 'user'" @click="showUserInfo(props.row)">
              <div class=" userBTN"><img
                  :src="'https://source.boringavatars.com/beam/30/' + (col.value === 'youHide' ? 'you' : col.value)"
                  class="profileImg"
                  :style="props.row.user?.record?.toBoard?.amount > 3 ? { 'box-shadow': '0 0 0 6px ' + (props.row.user.record.toBoard.amount > 20 ? '#ffc700' : props.row.user.record.toBoard.amount > 10 ? '#D6D8EA' : '#B87333') } : ''">
                <br>
                <b> {{ col.value === 'owner' ? t('owner') :
                    col.value === 'you' ? t('you') :
                      col.value === 'youHide' ?
                        t('youHide') : (col.value || t('anonymous'))
                }}</b>
              </div>
            </div>
            <div v-else-if="col.name === 'review'" @click="viewArticle(props.row)">
              <q-icon name="star" color="warning" />
              {{ col.value }}
            </div>
            <div v-else-if="col.name === 'tags'" @click="viewArticle(props.row)"
              style="width:120px;display:flex;flex-wrap:wrap;align-content: center;justify-content: center;">
              <p class="tag" v-for="t in (col.value)" :tag="t" :key="t">
                {{ parent.childBoard.article.category[0].tagOption
                  [t][langWord]
                }}
              </p>
            </div>
            <div v-else-if="col.name === 'title'" class=" title" @click="viewArticle(props.row)">
              {{ col.value }}
            </div>
            <div v-else-if="col.name === 'semester'" @click="viewArticle(props.row)">
              {{ col.value }}
            </div>
          </q-td>
          <q-td v-for="col in props.cols.filter(d => d.name === 'content')" :key="col.name" :props="props"
            class="mainContent">
            <div class="title">
              {{ props.row.title }}
            </div>
            <div class="content">
              <div class="htmlContent" v-html="col.value" @click="viewArticle(props.row)"></div>
              <div class="htmlBtn">
                <q-btn square color="primary" icon="message" flat style="height:100%" @click="viewArticle(props.row)">
                  <q-badge v-if="props.row.msg1?.amount" rounded>
                    {{ props.row.msg1.amount }}
                  </q-badge>
                </q-btn>
                <q-btn v-if="props.row.owner" square color="primary" flat icon="edit" style="height:100% "
                  @click="editArticle(props.row)">
                </q-btn>
                <q-btn v-if="props.row.owner" square color="red" flat icon="delete" style="height:100% "
                  @click="deleteId = props.row._id; confirmDelete = true">
                </q-btn>
                <q-btn v-if="users.role === 0" square color="red" flat icon="cancel" style="height:100% "
                  @click="banArticle(props.row._id)">
                </q-btn>
              </div>
            </div>
          </q-td>
        </q-tr>
        <q-tr v-else no-hover>
          <q-td colspan="6" class="q-ml-lg">{{ t('articleBanned') }}</q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog v-model="confirmDelete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="warning" color="warning" size="4rem" />
          <p class="alertTitle">{{ t('beware') }}</p>
          <p class="alertMsg q-ml-sm">{{ t('deleteLeaveRate') }}</p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn :label="t('cancel')" color="primary" v-close-popup />
          <q-btn flat :label="t('delete')" @click="deleteArticle()" color="negative" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
  <q-page v-else>
    <h6 style="margin-left: calc(5vw);">{{ t('noReview') }}</h6>
  </q-page>
</template>

<script setup>
import { apiAuth } from 'src/boot/axios'
import { useUserStore } from 'src/stores/user'
import { ref, inject, computed, provide } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const users = useUserStore()
// **********************************************子版清單***
const board = inject('board')
const parent = inject('parent')
// 記得article 裡面的user資訊只抓有用到的，新增項目要去後台getArticles增加iconbutton
const article = inject('article')
const articles = inject('articles')
const articleMsg = inject('articleMsg')
const viewArticleState = inject('viewArticleState')
const editArticleState = inject('editArticleState')
const editArticleContent = inject('editArticleContent')
const langWord = inject('langWord')
const userInfoState = inject('userInfoState')
const userInfoForm = inject('userInfoForm')

const pagination = ref({ rowsPerPage: 20 })
const confirmDelete = ref(false)
const deleteId = ref()
// 使用者資訊Dialog

const showUserInfo = (a) => {
  userInfoForm.titleTitle = 'user'
  userInfoForm.chartTitle = 'ratingChart'
  userInfoForm.title = a.title
  userInfoForm.scoreSum = a.user.record.toBoard.scoreSum
  userInfoForm.amount = a.user.record.toBoard.amount
  userInfoForm.bannedAmount = a.user.record.toBoard.bannedAmount
  userInfoForm.datas.length = 0
  userInfoForm.datas.push(...a.user.record.toBoard.scoreChart)
  userInfoState.value = true
}

const banArticle = async (id) => {
  // console.log(id)
  const { data } = await apiAuth.delete('/article/banArticle/' + id)
  const idx = articles.findIndex(it => it._id === data.result._id)
  if (idx >= 0) {
    console.log('ok')
    articles[idx] = data.result
  }
}
const deleteArticle = async () => {
  const { data } = await apiAuth.post('/article/', { _id: deleteId.value })
  if (data.success) {
    confirmDelete.value = false
    console.log('delete ok')
    articles.splice(articles.findIndex(it => it._id === deleteId.value), 1)
  }
}
// --

const editArticle = async (content) => {
  for (const k in editArticleContent) delete editArticleContent[k]
  Object.assign(editArticleContent, content)
  editArticleState.value = true
}

const viewArticle = (a) => {
  for (const k in article) delete article[k]
  Object.assign(article, a)
  // 加載使用者資訊介面
  userInfoForm.titleTitle = ''
  userInfoForm.chartTitle = ''
  userInfoForm.title = ''
  userInfoForm.scoreSum = a.user.record.toBoard.scoreSum
  userInfoForm.amount = a.user.record.toBoard.amount
  userInfoForm.bannedAmount = a.user.record.toBoard.bannedAmount
  userInfoForm.datas.length = 0
  userInfoForm.datas.push(...a.user.record.toBoard.scoreChart)
  //    加載留言介面資訊
  articleMsg._id = a._id
  articleMsg.isSelf = a.user.nickName === 'you'
  articleMsg.datas.length = 0
  if (a.msg1?.list) articleMsg.datas.push(...a.msg1?.list)
  viewArticleState.value = true
}
// --
const columns = computed(() => [
  {
    name: 'semester',
    align: 'left',
    label: t('semester'),
    field: row => {
      const unique = board?.uniqueData?.find(i => i._id === row.uniqueId)
      // 極少數會讀不道uniqueData
      return unique?.c80 || ''
    },
    sortable: true,
    sortOrder: 'da',
    headerClasses: 'q-table--col-auto-width'
  },
  {
    name: 'user',
    required: true,
    label: t('user'),
    align: 'left',
    field: row => row.user.nickName,
    // 似乎在header設就好
    // classes: 'q-table--col-auto-width',
    headerClasses: 'q-table--col-auto-width'
  },
  { name: 'review', align: 'left', label: t('score'), field: row => row.score, sortable: true, sortOrder: 'da', headerClasses: 'q-table--col-auto-width' },
  { name: 'tags', align: 'left', label: t('tags'), field: row => row.tags, sortable: true, sortOrder: 'da' },
  { name: 'content', align: 'left', label: parent?.childBoard?.article?.category[0]?.contentCol[langWord.value], field: row => row.content, sortOrder: 'da' }
])

// 要去母版看規則
provide('articleMsg', articleMsg)
provide('articles', articles)
</script>
<style lang="sass" scoped>
// .q-page
//   min-height: 0 !important
//   box-sizing: border-box
//   height: 100%
:deep(.q-table)
  height: fit-content
  background: #ddd
  //   th
  //   /* bg color is important for th; just specify one */
  //   background-color: #ddd
  thead tr th
    height: 40px
    text-align: center
    position: sticky
    z-index: 5
    padding: 0
    color: #fff
    font-size: 1rem
    top: 0
    background: rgba(15, 145, 250, 1)
    &:hover
      background: rgba(25, 155, 255, 1)
      // 確定mac正常就拿掉
  // tr
  //   height: 100%
  thead tr th:first-child
    padding: 0 0 0 8px
  tbody
    height: 100%
    .q-tr.a:hover>td
      cursor: pointer
  .q-td
    padding: 0
    height: 100%
    cursor: pointer
    background: rgba(231, 255,255, 1)
    &>div
      width: 100%
      height: 100%
      display: flex
      align-items: center
      justify-content: center
    &.mainContent
      max-height: 200px
      overflow: hidden
      padding: 10px
    .title
      font-weight: 500
      height: auto
      width: 100%
      display: inline-block
      border-bottom: 3px solid rgba(205, 255,255, 1)
      font-size: 1.2rem
      text-align: left
      margin: 0px 0 0 5px
    .content
      height: auto
      overflow: hidden
      width: auto
      margin-left: 6px
      min-height: 100px
      text-align: left
      display: flex
      justify-content: space-between
      .htmlBtn
        flex-shrink: 0
      .htmlContent
        align-self: flex-start
        max-height: 180px
        max-width: 50vw
        overflow: hidden
        // min-width: 10vw
        height: 100%
        text-align: left
        text-overflow: ellipsis
        display: -webkit-box
        -webkit-line-clamp: 7
        -webkit-box-orient: vertical
        flex-shrink: 1
        &:deep(*)
          margin: 0
        p
          margin: 0 0 2px 0
          font-size: 1rem
          // letter-spacing: 0.3px
        /* this is when the loading indicator appears */
        &.q-table--loading thead tr:last-child th
          top: 48px

  // 舊style
// .q-tr:nth-child(4n+1) td:nth-child(n+2)
//   background: #f8f8f8
// // 奇偶行不同顏色
// .q-tr:nth-child(4n+3) td
//   background: #FFF8F3
// .q-tr:nth-child(4n+3) td:nth-child(n+2)
//   background: #FAF3EF
// .q-tr:nth-child(4n) td
//   background: #FFF8F3
// .q-tr td:nth-child(4) button
//   text-align: left
// 新
// 奇偶行不同顏色
.q-tr:nth-child(2n+1) td
  background: rgba(255,255,255,1)
.tag
  display: inline-block
  width: 30px
  margin: 2px
  text-align: center
  color: white
  background: green
  border-radius: 8px
  height: fit-content
.q-btn
  padding: 0 5px
.alertTitle
  margin: 20px 10px
  color: red
  font-size: 30px
  font-weight: 700
.alertMsg
  font-size: 20px
  font-weight: 600

.userBTN
  font-size: 12px
  padding: 6px 0 0 0
  width: 80px
  overflow: hidden
  text-align: center
  flex-grow: 1
  &:hover
    background: rgba(100,200,255,0.1)
.profileImg
  border-radius: 50%
  // #ffc700
  // #D6D8EA
  // #B87333
  // content: ''
  // width: 100px
  // height: 100px
  // background: red
  // border-raidius: 50%
</style>

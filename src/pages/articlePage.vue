<template>
  <q-page class="flex flex-center" v-if="articles.length > 0">
    <q-table :rows="articles" :columns="columns" row-key="_id" :virtual-scroll="pagination.rowsPerPage === 0"
      v-model:pagination="pagination" :no-data-label="t('noFound')"
      :rows-per-page-options="[0, 10, 15, 20, 30, 40, 50, 80, 100]" separator="none">
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" auto-width v-if="props.row.state != 0">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <button v-if="col.name === 'user'" class="cellBTN"
              @click="showUserInfo(col.value, props.row.user.record.toBoard.scoreSum, props.row.user.record.toBoard.amount, props.row.user.record.toBoard.scoreChart)">
              <img :src="'https://source.boringavatars.com/beam/30/' + (col.value||'you')">
              <br>
              <b> {{ col.value === 'originalPoster' ? t('originalPoster') :(col.value === 'you'||col.value ===undefined)
              ? t('you'):
              (col.value || t('anonymous')) }}</b></button>
            <div v-else-if="col.name === 'review'">
              <q-icon name="star" color="warning" />
              {{ col.value }}
            </div>
            <div v-else-if="col.name === 'tags'">
              <p class="tag" v-for="t in (col.value )" :tag="t" :key="t">
                {{ parent.childBoard.article.category[0].tagOption
                [t][langWord] }}
              </p>
            </div>
            <div v-else-if="col.name === 'title'" class="title">
              {{ col.value }}
            </div>
            <div v-else-if="col.name === 'semester'">
              {{ col.value }}
            </div>
            <div v-else-if="col.name === 'content'" class="content"
              style="text-align: left; display:flex;justify-content: space-between; height:100%">
              <button class="openViewBtn" @click="viewArticle(props.row)">
                <div class="htmlContent" v-html="col.value"></div>
              </button>
              <div>
                <q-btn square color="primary" icon="message" flat style="height:100% " @click="showMsgInfo(props.row)">
                  <q-badge v-if="props.row.msg1?.amount" rounded>
                    {{ props.row.msg1.amount }}
                  </q-badge>
                </q-btn>
                <q-btn v-if="props.row.owner" square color="primary" flat icon="edit" style="height:100% "
                  @click="editArticle(props.row)">
                </q-btn>
                <q-btn v-if="props.row.owner" square color="red" flat icon="delete" style="height:100% "
                  @click="deleteId=props.row._id;confirmDelete = true">
                </q-btn>
                <q-btn v-if="users.role === 0" square color="red" flat icon="cancel" style="height:100% "
                  @click="banArticle(props.row._id)">
                </q-btn>
              </div>
            </div>
          </q-td>
        </q-tr>
        <q-tr v-else no-hover>
          <q-td colspan="6" class="q-ml-lg">{{t('articleBanned')}}</q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog v-model="userInfoState">
      <chartInfo :form="userInfoForm" />
    </q-dialog>
    <q-dialog v-model="msgState">
      <messageDialog />
    </q-dialog>
    <q-dialog v-model="confirmDelete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="warning" color="warning" size="4rem" />
          <p class="alertTitle">{{t('beware')}}</p>
          <p class="alertMsg" bclass="q-ml-sm">{{t('deleteLeaveRate')}}</p>
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
import chartInfo from 'components/chartInfo.vue'
import messageDialog from 'components/messageDialog.vue'
import { ref, reactive, inject, computed, provide } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

// **********************************************子版清單***
const board = inject('board')
const parent = inject('parent')
const article = inject('article')
const articles = inject('articles')
const articleMsg = inject('articleMsg')
const viewArticleState = inject('viewArticleState')
const editArticleState = inject('editArticleState')
const editArticleContent = inject('editArticleContent')
const langWord = inject('langWord')
const users = useUserStore()

const pagination = ref({ rowsPerPage: 20 })
const confirmDelete = ref(false)
const deleteId = ref()
// 使用者資訊Dialog
const userInfoState = ref(false)
const userInfoForm = reactive({ titleCol: 'user', title: '', averageTitle: 'averageGiveScore', chartTitle: 'ratingChart', scoreSum: 0, amount: 0, datas: [] })
const showUserInfo = (title, scoreSum, amount, datas) => {
  userInfoForm.title = title
  userInfoForm.scoreSum = scoreSum
  userInfoForm.amount = amount
  userInfoForm.datas.length = 0
  userInfoForm.datas.push(...datas)
  userInfoState.value = true
}
// 文章留言 Dialog
const msgState = ref(false)

const showMsgInfo = (it) => {
  articleMsg._id = it._id
  articleMsg.isSelf = it.user.nickName === 'you'
  articleMsg.datas.length = 0
  if (it.msg1?.list) articleMsg.datas.push(...it.msg1?.list)
  msgState.value = true
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
  console.log(article)
  viewArticleState.value = true
}
// --
const columns = computed(() => [
  {
    name: 'semester',
    align: 'left',
    label: t('semester'),
    field: row => {
      const unique = board.uniqueData.find(i => i._id === row.uniqueId)
      // console.log(board.uniqueData)
      return unique.c80
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
  { name: 'tags', align: 'left', label: t('tags'), field: row => row.tags, sortable: true, sortOrder: 'da', headerClasses: 'q-table--col-auto-width' },
  { name: 'title', align: 'left', label: t('title'), field: row => row.title, sortOrder: 'da' },
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
.q-table
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #fff
  thead tr th
    position: sticky
    z-index: 1
    padding: 0 0 0 10px
  tr
    max-height: 200px !important
    overflow: hidden
  td:first-child
    padding-left: 8px
  thead tr:first-child th
    top: 0
  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
.q-td
  padding: 0
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
  background: #f5f5f5
.q-tr td:nth-child(4) button
  text-align: left
.tag
  display: inline-block
  width: 30px
  margin: 0 2px
  text-align: center
  color: white
  background: green
  border-radius: 50px
.cellBTN
  width: 100%
  height: 100%
  background: transparent
  border: none
  cursor: pointer
.q-btn
  padding: 0 5px
.content
  width: 100%
.title
  max-width: 150px
  overflow: hidden
  white-space: nowrap
  text-overflow: ellipsis
.alertTitle
  margin: 20px 10px
  color: red
  font-size: 30px
  font-weight: 700
.alertMsg
  font-size: 20px
  font-weight: 600
.htmlContent
  text-align: left
  max-height: 200px
  overflow: hidden
  text-overflow: ellipsis
  display: -webkit-box
  -webkit-line-clamp: 8
  -webkit-box-orient: vertical
  &:deep(*)
    margin: 0
.openViewBtn
  max-width: calc(200px + 20vw)
  border: none
  background: transparent
</style>

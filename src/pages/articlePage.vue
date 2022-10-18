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
              <img :src="'https://source.boringavatars.com/beam/30/' + col.value">
              <br>
              {{ col.value || t('anonymous') }}</button>
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
            <div v-else-if="col.name === 'title'">
              {{ col.value }}
            </div>
            <div v-else-if="col.name === 'semester'" style="text-align: left;">
              {{ col.value }}
            </div>
            <div v-else-if="col.name === 'content'" class="content"
              style="text-align: left; display:flex;justify-content: space-between; height:100%">
              <div v-html="col.value"></div>
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
                  @click="deleteArticle(props.row._id)">
                </q-btn>
                <q-btn v-if="users.role === 0" square color="red" flat icon="cancel" style="height:100% "
                  @click="banMsg(props.row._id)">
                </q-btn>
              </div>
            </div>
          </q-td>
        </q-tr>
        <q-tr v-else no-hover>
          <q-td colspan="6" class="q-ml-lg">此文章已經被版主屏蔽</q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog v-model="userInfoState">
      <chartInfo :form="userInfoForm" />
    </q-dialog>
    <q-dialog v-model="msgState">
      <messageDialog />
    </q-dialog>
  </q-page>
  <q-page v-else>
    <h6 style="margin-left: calc(5vw);">{{ t('noReview') }}</h6>
  </q-page>
</template>

<script setup scoped>
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
const articles = inject('articles')
const editArticleState = inject('editArticleState')
const editArticleContent = inject('editArticleContent')
const langWord = inject('langWord')
const users = useUserStore()

const pagination = ref({ rowsPerPage: 20 })
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
const article = reactive({ datas: [], _id: '', isSelf: false })
const showMsgInfo = (it) => {
  article._id = it._id
  article.isSelf = it.user.nickName === 'you'
  article.datas.length = 0
  if (it.msg1?.list) article.datas.push(...it.msg1?.list)
  msgState.value = true
}
const banMsg = async (id) => {
  // console.log(id)
  const { data } = await apiAuth.delete('/article/banMsg/' + id)
  const idx = articles.findIndex(it => it._id === data.result._id)
  if (idx >= 0) {
    console.log('ok')
    articles[idx] = data.result
  }
}
const deleteArticle = async (id) => {
  const { data } = await apiAuth.delete('/article/' + id)
  if (data.success) {
    console.log('delete ok')
    articles.splice(articles.findIndex(it => it._id === id), 1)
  }
}
// --

const editArticle = async (content) => {
  for (const k in editArticleContent) delete editArticleContent[k]
  Object.assign(editArticleContent, content)
  editArticleState.value = true
}
// --
const columns = computed(() => [
  {
    name: 'semester',
    align: 'left',
    label: t('semester'),
    field: row => {
      const unique = board.uniqueData.find(i => i._id === row.uniqueId)
      // console.log(row.uniqueId)
      // console.log(board.uniqueData)
      // console.log(unique)
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
provide('article', article)
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
.content
  width: 100%
  // max-width: 30vw
  max-height: 200px
  &:deep(> div)
    max-width: calc(200px + 10vw)
    overflow: hidden
</style>

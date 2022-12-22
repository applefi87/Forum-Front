<template>
  <q-page v-if="boards.length > 0">
    <q-table :rows="filtedBoards" :columns="columns" row-key="_id" v-model:pagination="pagination"
      :rows-per-page-options="[15, 30, 50]">
      <template v-slot:header="props">
        <q-tr>
          <q-th colspan="8" class="searchTd">
            <q-input borderless dense debounce="999999" v-model="filter" :placeholder="t('search')" outlined
              style="width:300px; max-width:80%;display:inline-block;float:right ;margin:0 10px 0 10px">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </q-th>
        </q-tr>
        <q-tr :props="props">
          <q-th v-for="col in props.cols.filter((c) => !([].find((n) => n === c.name)))" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" class="colTR">
          <q-td v-for="col in props.cols.filter((c) => (['review'].find((n) => n === c.name)))" :key="col.name"
            :props="props">
            <router-link :to="'/board/' + props.row._id" class="btnLink" target="_blank">
              <div>
                <div v-if="col.value <= 0"></div>
                <q-rating v-else v-model="col.value" size="1em" color="grey" color-selected="warning" readonly />
              </div>
            </router-link>
          </q-td>
          <q-td
            v-for="col in props.cols.filter((c) => !(['tag', 'review', 'rewiewNumber', 'title', 'teacher'].find((n) => n === c.name))) "
            :key="col.name" :props="props" :auto-width="false">
            <router-link :to="'/board/' + props.row._id" class="btnLink" target="_blank">
              <div> {{ col.value }}</div>
            </router-link>
          </q-td>
          <q-td v-for="col in props.cols.filter((c) => (['title', 'teacher'].find((n) => n === c.name))) "
            :key="col.name" :props="props" :auto-width="false">
            <router-link :to="'/board/' + props.row._id" class="btnLink" target="_blank">
              <div style="text-align:left" :class="col.name === 'title' ? 'title' : ''"> {{ col.value }}</div>
            </router-link>
          </q-td>
          <q-td v-for="col in   props.cols.filter((c) => (['rewiewNumber'].find((n) => n === c.name)))" :key="col.name"
            :props="props" target="_blank" auto-width>
            <router-link :to="'/board/' + props.row._id" class="btnLink" target="_blank">
              <div> {{ (col.value >= 0 ? col.value : '') }}</div>
            </router-link>
          </q-td>
          <q-td v-for="col in   props.cols.filter((c) => (['tag'].find((n) => n === c.name)))" :key="col.name"
            :props="props">
            <router-link :to="'/board/' + props.row._id" class="btnLink" target="_blank">
              <div v-if="col.value"
                style="width:80px;display:flex;flex-wrap:wrap;align-content: center;justify-content: center;">
                <div class="tag" v-for="k in (Object.keys(col.value))" :key="k">
                  <!-- {{board.childBoard.article.category}} -->
                  {{ reviewRule.tagOption[k][langWord] }}
                </div>
              </div>
            </router-link>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
  <q-page v-else>
    <h6 style="margin-left: calc(5vw);">{{ t('searchFirst') }}</h6>
  </q-page>
</template>

<script setup>
import { ref, inject, computed } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
// **********************************************子版清單***
const board = inject('board')
const boards = inject('boards')
const filter = inject('filter')
const langWord = inject('langWord')
// ----------
const reviewRule = computed(() => board.childBoard.article.category.find(i => i.c === 1))
//
const filtedBoards = computed(() => {
  return boards.filter((s) => {
    return RegExp('.*' + filter.value + '.*', 'i').test(s.colData.c40)
  })
})
const pagination = ref({ rowsPerPage: 15 })

const columns = computed(() => [
  // 分母沒值會報錯，所以先預留1來保底
  { name: 'review', align: 'left', label: t('score'), field: row => (Math.ceil(row.beScored?.scoreSum / (row.beScored?.amount || 1)) || ''), sortable: true, sortOrder: 'da' },
  {
    name: 'department',
    required: true,
    label: board.childBoard.rule.transformTable.c0[langWord.value],
    align: 'left',
    field: row => row.colData.c0,
    // 似乎在header設就好
    // classes: 'q-table--col-auto-width',
    headerClasses: 'q-table--col-auto-width'
  },
  // , headerClasses: 'q-table--col-auto-width'
  { name: 'score', align: 'left', label: board.childBoard.rule.transformTable.c50[langWord.value], field: row => (row.colData.c50 || 0), sortable: true, sortOrder: 'da' },
  { name: 'required', align: 'left', label: board.childBoard.rule.transformTable.c55[langWord.value], field: row => row.colData.c55, sortable: true, sortOrder: 'da' },
  {
    name: 'title',
    align: 'left',
    label: board.childBoard.rule.transformTable[board.childBoard.rule.titleCol[langWord.value]][langWord.value],
    field: row => row.colData[board.childBoard.rule.titleCol[langWord.value]]
  },
  { name: 'teacher', align: 'left', label: board.childBoard.rule.transformTable.c60[langWord.value], field: row => (row.colData.c60 || ''), sortable: true, sortOrder: 'da' },
  { name: 'rewiewNumber', align: 'left', label: t('review'), field: row => row.beScored?.amount || '', sortable: true, sortOrder: 'da' },
  {
    name: 'tag',
    align: 'left',
    label: t('tags'),
    field: row => {
      if (row.beScored?.tags) {
        const rateThreshold = row.beScored?.amount / 3
        const m = new Map(Object.entries(row.beScored?.tags))
        for (const [k, v] of m) {
          if (!(v > rateThreshold)) m.delete(k)
        }
        return Object.fromEntries(m)
      } else {
        return {}
      }
    }
  }
]
)

</script>
<style lang="sass" scoped>

.q-table
  thead
    tr
      background: rgba(15, 145, 250, 1)
      th
        font-size: 0.9rem
        z-index: 1
        padding: 0
        color: #fff
        text-align: center
        border-bottom: 0
        &:nth-child(2):hover
          background: rgba(25, 155, 255, 1)
        &.searchTd label
          background: #fff
          border-radius: 6px
    tr:nth-child(2) th
      position: sticky
      top: 0
  tbody
    td
      height: auto
      background: rgba(231, 255,255, 1)
      font-size: 0.9rem
    .q-tr.a:hover>td
      background: #f0f0f0
    .q-tr:nth-child(2n+1) td
      background: rgba(255,255,255,1)
  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
.q-td
  padding: 0 5px !important
  min-width: 60px
.tag
  display: inline-block
  height: 20px
  line-height: 20px
  width: 30px
  margin: 0 2px
  text-align: center
  color: white
  background: green
  border-radius: 50px
.colTR
  height: 10px
// .q-tr:nth-child(2n+1) td
//   background: #f5f5f5

.q-tr td:nth-child(5) a
  display: inline-block
  max-width: calc(300px + 10vw)
  min-width: 200px
  width: calc(60vw - 200px)
.btnLink
  width: 100%
  height: 100%
  background: transparent
  border: none
  cursor: pointer
  &:link
    color: rgb(0, 102, 204)
  &:visited
    color: rgb(80, 42, 124)
  &>div
    height: 100%
    line-height: 48px
    max-width: 120px
    overflow: hidden
    white-space: nowrap
    text-overflow: ellipsis
    text-align: center
    &.title
      max-width: initial
a
  text-decoration: none

</style>

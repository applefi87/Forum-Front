<template>
  <q-page v-if="boards.length > 0">
    <q-table :rows="filtedBoards" :columns="columns" row-key="_id" :virtual-scroll="pagination.rowsPerPage > 49"
      v-model:pagination="pagination" auto-width separator="none" :rows-per-page-options="[0, 15, 30, 50, 100]">
      <template v-slot:header="props">
        <q-tr>
          <q-td colspan="8" class="searchTd">
            <q-input borderless dense debounce="300" v-model="filter" :placeholder="t('search')" outlined
              style="width:300px; max-width:80%;display:inline-block;float:right ;margin:0 10px 0 10px">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </q-td>
        </q-tr>
        <q-tr :props="props">
          <q-th v-for="col in props.cols.filter((c) => !([].find((n) => n === c.name)))" :key="col.name" :props="props">
            {{  col.label  }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" class="colTR" no-hover>
          <q-td v-for="col in props.cols.filter((c) => !(['tag', 'review', 'rewiewNumber'].find((n) => n === c.name))) "
            :key="col.name" :props="props">
            <button class="cellBTN limited-length" @click="router.push('/board/' + props.row._id)">
              {{  col.value  }}</button>
          </q-td>
          <q-td v-for="col in props.cols.filter((c) => (['review'].find((n) => n === c.name)))" :key="col.name"
            :props="props">
            <button class="cellBTN" @click="router.push('/board/' + props.row._id)">
              <div v-if="col.value < 0"></div>
              <q-icon v-else name="star" color="warning" v-for="it of ([].length = col.value) " :key="it" />
            </button>
          </q-td>
          <q-td v-for="col in   props.cols.filter((c) => (['rewiewNumber'].find((n) => n === c.name)))" :key="col.name"
            :props="props">
            <button class="cellBTN" @click="router.push('/board/' + props.row._id)">
              {{  (col.value >= 0 ? col.value : '')  }}
            </button>
          </q-td>
          <q-td v-for="col in   props.cols.filter((c) => (['tag'].find((n) => n === c.name)))" :key="col.name"
            :props="props">
            <button class="cellBTN" @click="router.push('/board/' + props.row._id)">
              <div class="tag" v-for="t in (col.value || ['無'])" :tag="t" :key="t">
                {{  t  }}
              </div>
            </button>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
  <q-page v-else>
    <h6 style="margin-left: calc(5vw);">請點選功能列，搜尋您想查詢的課程評價。</h6>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, inject, computed } from 'vue'
import { useI18n } from 'vue-i18n'
const router = useRouter()
const { t } = useI18n()
// **********************************************子版清單***
const boards = inject('boards')
const hasChild = inject('hasChild')
// ----------
const filter = ref('')
const filtedBoards = computed(() => {
  return boards.filter((s) => {
    return s.title.match(RegExp('.*' + filter.value + '.*', 'i'))
  })
})
const pagination = ref({ rowsPerPage: 15 })
const columns = computed(() => [
  {
    name: 'department',
    required: true,
    label: t('department'),
    align: 'left',
    field: row => row.colData.c0,
    // 似乎在header設就好
    // classes: 'q-table--col-auto-width',
    headerClasses: 'q-table--col-auto-width'
  },
  // , headerClasses: 'q-table--col-auto-width'
  { name: 'score', align: 'left', label: t('credits'), field: row => (row.colData.c50 || 0), sortable: true, sortOrder: 'da' },
  { name: 'required', align: 'left', label: t('required'), field: row => row.colData.c55, sortable: true, sortOrder: 'da' },
  { name: 'title', align: 'left', label: t('className'), field: 'title' },
  { name: 'teacher', align: 'left', label: t('teacher'), field: row => (row.colData.c60 || ''), sortable: true, sortOrder: 'da' },
  { name: 'review', align: 'left', label: t('score'), field: row => (row.beScored?.score || ''), sortable: true, sortOrder: 'da' },
  { name: 'rewiewNumber', align: 'left', label: t('rewiewNumber'), field: row => row.beScored?.amount || '', sortable: true, sortOrder: 'da' },
  { name: 'tag', align: 'left', label: t('tags'), field: row => row.beScored?.tag }
]
)
// **********************************************子文章清單***
// 要去母版看規則

</script>
<style lang="sass" scoped>
.q-table
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #fff
  thead tr th
    position: sticky
    z-index: 1
    padding: 5px
  thead tr:first-child th
    top: 0
  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
.q-td
  padding: 0 !important
.tag
  display: inline-block
  width: 30px
  margin: 0 2px
  text-align: center
  color: white
  background: green
  border-radius: 50px
.q-td
  padding: 0
.colTR
  height: 10px
// .limited-length
//   max-width: 100px
// 舊版CSS
// .q-tr td:nth-child(4)
//   background: #f9f9f9
//   border-bottom: solid #999 1px
// .q-tr:nth-child(even) td
//   border-bottom: solid #999 1px
//   // 之後再處理
// // 奇偶行不同顏色
// .q-tr:nth-child(4n+3) td
//   background: #fffaf4
// .q-tr:nth-child(4n+3) td:nth-child(4)
//   background: #fff5e4
// .q-tr:nth-child(4n) td
//   background: #fffaf4
// 新版CSS

// 奇偶行不同顏色

.q-tr:nth-child(2n+1) td
  background: #f5f5f5
.q-tr td:nth-child(4) button
  text-align: left
.q-tr td.searchTd
  background: #fff
td:nth-child(4)
  max-width: 200px
td:nth-child(5)
  max-width: 100px
.cellBTN
  width: 100%
  height: 100%
  background: transparent
  border: none
  cursor: pointer
  text-align: left
  overflow: hidden
</style>

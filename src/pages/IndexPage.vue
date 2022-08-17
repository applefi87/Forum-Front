<template>
  <q-page class="flex flex-center">
    <q-table title="Treats" :rows="filtedBoards" :columns="columns" row-key="_id"
      :virtual-scroll="pagination.rowsPerPage === 0" v-model:pagination="pagination" auto-width separator="none"
      no-data-label="無資料" grid-header :rows-per-page-options="[0, 10, 15, 20, 30, 40, 50, 80, 100]"
      style="height: 700px ;width:900px">
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols.filter((c) => !(['title', 'tag', 'review'].find((n) => n === c.name)))"
            :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
          <q-th v-for="col in props.cols.filter((c) => (['review'].find((n) => n === c.name)))" :key="col.name"
            :props="props">
            <div style="line-height:40px ;display:inline-block">{{ col.label }}</div>
            <q-input borderless dense debounce="300" v-model="filter" placeholder="Search" outlined label="搜尋"
              style="width:500px;display:inline-block;float:right">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" class="colTR q-tr--no-hover">
          <q-td v-for="col in props.cols.filter((c) => !(['title', 'review', 'tag'].find((n) => n === c.name)))"
            :key="col.name" :props="props">
            <q-btn class="cellBTN" flat align="left" @click="changePage('/' + props.row._id)">
              {{ col.value }}</q-btn>
          </q-td>
          <q-td v-for="col in props.cols.filter((c) => (['review'].find((n) => n === c.name)))" :key="col.name"
            :props="props" rowspan="2">
            <q-btn class="cellBTN" flat align="left" @click="changePage('/' + props.row._id)">
              <div style="display:flex;flex-direction: column;justify-content: space-between; height: 100% ">
                <div>
                  <div class="tag" v-for="t in (props.row.beScored?.tag ? props.row.beScored?.tag : ['涼', '甜', '閒'])"
                    :tag="t" :key="t">
                    {{ t }}
                  </div>
                </div>
                評分 {{ col.value }}&nbsp; 評價{{ props.row.beScored?.amount ? props.row.beScored?.amount : 0 }}則
              </div>
            </q-btn>
          </q-td>
        </q-tr>
        <q-tr :props="props" class="q-tr--no-hover">
          <q-td colspan="3">
            <q-btn class="cellBTN" flat align="left" @click="changePage('/' + props.row._id)">
              {{ props.row.title }}
            </q-btn>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { api } from 'src/boot/axios'
import { useRouter } from 'vue-router'
import { ref, reactive, inject, computed } from 'vue'
import { useI18n } from 'vue-i18n'
const router = useRouter()
const { t } = useI18n()
const tt = {
  key: '62fb4b72d0b2f85be87f44cb',
  row: {
    _id: '62fb4b72d0b2f85be87f44cb',
    title: '初階服務學習－學系',
    colData: {
      c0: '全人中心', c40: '初階服務學習－學系', c55: '必', c45: 'Basic Service-Learning', c10: '0000079', c60: '廖皎含'
    }
  },
  pageIndex: 0,
  __trClass: '',
  cols: [
    { name: 'department', required: true, label: '系所/通識', align: 'left', __iconClass: 'q-table__sort-icon q-table__sort-icon--left', __thClass: 'text-left', value: '全人中心' },
    { name: 'score', align: 'left', label: '學分', sortable: true, sortOrder: 'da', __iconClass: 'q-table__sort-icon q-table__sort-icon--left', __thClass: 'text-left sortable', value: 0 },
    { name: 'required', align: 'left', label: '必/選', sortable: true, sortOrder: 'da', __iconClass: 'q-table__sort-icon q-table__sort-icon--left', __thClass: 'text-left sortable', value: '必' }],
  colsMap: {
    department: { name: 'department', required: true, label: '系所/通識', align: 'left', __iconClass: 'q-table__sort-icon q-table__sort-icon--left', __thClass: 'text-left' },
    score: { name: 'score', align: 'left', label: '學分', sortable: true, sortOrder: 'da', __iconClass: 'q-table__sort-icon q-table__sort-icon--left', __thClass: 'text-left sortable' },
    required: { name: 'required', align: 'left', label: '必/選', sortable: true, sortOrder: 'da', __iconClass: 'q-table__sort-icon q-table__sort-icon--left', __thClass: 'text-left sortable' }
  },
  rowIndex: 0,
  color: 'grey-8',
  dark: false,
  dense: false,
  expand: false
}
// const testGetAllBoard = async () => {
//   const { data } = await api.post('/board/62f60dea0e28c1a18208dac8', { t: 5 })
//   console.log('ok')
//   const boards = data.result
//   console.log(boards.filter((b) => b.colData.c0 === '通識'))
// }
const boards = inject('boards')
const init = inject('init')
const filter = ref('')

const filtedBoards = computed(() => {
  return boards.filter((s) => {
    return s.title.match(RegExp('.*' + filter.value + '.*', 'i'))
  })
})

const pagination = ref({ rowsPerPage: 0 })
const columns = reactive([
  {
    name: 'department',
    required: true,
    label: '系所/通識',
    align: 'left',
    field: row => row.colData.c0,
    // 似乎在header設就好
    // classes: 'q-table--col-auto-width',
    headerClasses: 'q-table--col-auto-width'
  },
  { name: 'score', align: 'left', label: '學分', field: row => (row.colData.c50 ? row.colData.c50 : 0), sortable: true, sortOrder: 'da', headerClasses: 'q-table--col-auto-width' },
  { name: 'required', align: 'left', label: '必/選', field: row => row.colData.c55, sortable: true, sortOrder: 'da', headerClasses: 'q-table--col-auto-width' },
  { name: 'tag', align: 'left', label: '標籤', field: row => (row.beScored?.tag ? row.beScored?.tag : ['涼', '甜', '閒']) },
  { name: 'review', align: 'left', label: '評分', field: row => (row.beScored?.score ? row.beScored?.score : 6), sortable: true, sortOrder: 'da' },
  { name: 'title', label: '課程名', field: 'title' }
]
)
const changePage = (url) => {
  console.log(url)
  router.push(url)
  init(url)
}
</script>
<style lang="sass">
.q-table
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #c1f4cd
  thead tr th
    position: sticky
    z-index: 1
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
.colTR
  height: 10px
  .q-td
    height: 10px
.q-tr td:nth-child(4)
  background: #f9f9f9
  border-bottom: solid #999 1px
.q-tr:nth-child(even) td
  border-bottom: solid #999 1px
  // 之後再處理
.colTR .q-tr:hover .q-td
  background: red !important
.cellBTN
  height: 100%
  width: 100%
  //統一移除hover的方法
  //
body.desktop .q-focusable:focus .q-focus-helper,
body.desktop .q-hoverable:hover .q-focus-helper
  background: inherit
  opacity: 0

body.ios .q-hoverable:active .q-focus-helper
  background: inherit
  opacity: 0

.q-focus-helper
  opacity: 0
  transition: unset

</style>

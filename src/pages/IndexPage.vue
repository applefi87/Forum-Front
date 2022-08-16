<template>
  <q-page class="flex flex-center">
    <q-table title="Treats" :rows="filtedBoards" :columns="columns" row-key="_id"
      :virtual-scroll="pagination.rowsPerPage === 0" v-model:pagination="pagination" auto-width separator="none"
      grid-header :rows-per-page-options="[0, 10, 15, 20, 30, 40, 50, 80, 100]" style="height: 700px ;width:900px">
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
        <q-tr :props="props" class="colTR">
          <q-td v-for="col in props.cols.filter((c) => !(['title', 'review', 'tag'].find((n) => n === c.name)))"
            :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
          <q-td v-for="col in props.cols.filter((c) => (['review'].find((n) => n === c.name)))" :key="col.name"
            :props="props" rowspan="2">
            <div style="display:flex;flex-direction: column;justify-content: space-between; height: 100% ">
              <div>
                <div class="tag" v-for="t in (props.row.tag ? props.row.tag : ['涼', '甜', '閒'])" :tag="t" :key="t">
                  {{ t }}
                </div>
              </div>
              <div>{{ col.value }}</div>
            </div>
          </q-td>
        </q-tr>
        <q-tr :props="props">
          <q-td colspan="3">
            <div class="text-left"> {{ props.row.title }}</div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { api } from 'src/boot/axios'
import { ref, reactive, inject, computed } from 'vue'
import { useI18n } from 'vue-i18n'
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
  { name: 'tag', align: 'left', label: '標籤', field: row => (row.tag ? row.tag : ['涼', '甜', '閒']) },
  { name: 'review', align: 'left', label: '評分', field: row => (row.review ? row.review : 6), sortable: true, sortOrder: 'da' },
  { name: 'title', label: '課程名', field: 'title' }
]
)

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
  background: #cccccc
  border-bottom: solid #999 1px
.q-tr:nth-child(even) td
  border-bottom: solid #999 1px
</style>

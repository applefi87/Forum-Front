<template>
  <q-page class="flex flex-center">
    <q-table title="Treats" :rows="filtedBoards" :columns="columns" row-key="_id"
      :virtual-scroll="pagination.rowsPerPage === 0" :filter="filter" v-model:pagination="pagination"
      :rows-per-page-options="[0, 10, 15, 20, 30, 40, 50, 80, 100]" style="height: 700px ;width:900px">
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search" outlined label="搜尋">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <div v-if="col.name === 'name'">
              這是{{ col.value }}
            </div>
            <div v-else> {{ col.value }}</div>
          </q-td>
        </q-tr>
        <q-tr :props="props">
          <q-td colspan="100%">
            <div class="text-left">This is expand slot for row above: {{ props.row.name }}.</div>
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

// const testGetAllBoard = async () => {
//   const { data } = await api.post('/board/62f60dea0e28c1a18208dac8', { t: 5 })
//   console.log('ok')
//   const boards = data.result
//   console.log(boards.filter((b) => b.colData.c0 === '通識'))
// }
const boards = inject('boards')
console.log(boards)
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
    field: row => row.colData.c0
  },
  { name: 'score', align: 'left', label: '學分', field: row => row.colData.c50, sortable: true, sortOrder: 'da' },
  { name: 'required', align: 'left', label: '必/選', field: row => row.colData.c55, sortable: true, sortOrder: 'da' },
  { name: 'review', label: '評分', field: row => (row.review ? row.review : 6), sortable: true, sortOrder: 'da' },
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
</style>

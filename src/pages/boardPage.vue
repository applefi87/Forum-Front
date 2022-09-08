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
            <router-link :to="'/board/' + props.row._id" class="btnLink" target="_blank">
              <div> {{  col.value  }}</div>
            </router-link>
          </q-td>
          <q-td v-for="col in props.cols.filter((c) => (['review'].find((n) => n === c.name)))" :key="col.name"
            :props="props">
            <router-link :to="'/board/' + props.row._id" class="btnLink" target="_blank">
              <div>
                <div v-if="col.value < 0"></div>
                <q-icon v-else name="star" color="warning" v-for="it of ([].length = col.value) " :key="it" />
              </div>
            </router-link>
          </q-td>
          <q-td v-for="col in   props.cols.filter((c) => (['rewiewNumber'].find((n) => n === c.name)))" :key="col.name"
            :props="props" target="_blank">
            <router-link :to="'/board/' + props.row._id" class="btnLink" target="_blank">
              <div> {{  (col.value >= 0 ? col.value : '')  }}</div>
            </router-link>
          </q-td>
          <q-td v-for="col in   props.cols.filter((c) => (['tag'].find((n) => n === c.name)))" :key="col.name"
            :props="props">
            <router-link :to="'/board/' + props.row._id" class="btnLink" target="_blank">
              <div>
                <div class="tag" v-for="t in (col.value || ['無'])" :tag="t" :key="t">
                  {{  t  }}
                </div>
              </div>
            </router-link>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
  <q-page v-else>
    <h6 style="margin-left: calc(5vw);">{{  t('searchFirst')  }}</h6>
  </q-page>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, inject, computed } from 'vue'
import { useI18n } from 'vue-i18n'
const route = useRoute()
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

</script>
<style lang="sass" scoped>
.q-table
  .q-table__top,
  .q-table__bottom,
  thead
    tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #fff
    tr th
      position: sticky
      z-index: 1
      padding: 5px
    tr:first-child th
      top: 0
  tbody .q-tr:hover>td
    background: #f0f0f0
  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

.q-td
  padding: 0 5px !important
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
.btnLink
  width: 100%
  height: 100%
  background: transparent
  border: none
  cursor: pointer
  overflow: hidden
  &>div
    height: 100%
    line-height: 48px
a
  text-decoration: none
</style>

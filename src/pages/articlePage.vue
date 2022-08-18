<template>
  <q-page class="flex flex-center">
    <q-table v-if="hasArticle" :rows="articles" :columns="columns" row-key="_id"
      :virtual-scroll="pagination.rowsPerPage === 0" v-model:pagination="pagination" auto-width no-data-label="無資料"
      grid-header :rows-per-page-options="[0, 10, 15, 20, 30, 40, 50, 80, 100]" style="height: 700px ;width:900px">
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" class="colTR q-tr--no-hover">
          <q-td v-for="col in props.cols.filter((c) => (['userScore'].find((n) => n === c.name)))" :key="col.name"
            :props="props">
            <q-btn class="cellBTN" flat align="left" @click="open(props.row._id)">
              <div style="display:flex;flex-direction: column;justify-content: space-between; height: 100% ">
                {{ props.row.user.nickName }}
                <br>
                &nbsp; {{ props.row.user.score || '白紙用戶' }}
              </div>
            </q-btn>
          </q-td>
          <q-td v-for="col in props.cols.filter((c) => (['review'].find((n) => n === c.name)))" :key="col.name"
            :props="props">
            <q-btn class="cellBTN" flat align="left" @click="open(props.row._id)">
              <div style="display:flex;flex-direction: column;justify-content: space-between; height: 100% ">
                {{ props.row.title }}
                <br>
                {{ col.value }}
                <div class="tag" v-for="t in (props.row.tags || ['涼', '甜', '閒'])" :tag="t" :key="t">
                  {{ t }}
                </div>
              </div>
            </q-btn>
          </q-td>
          <q-td v-for="col in props.cols.filter((c) => (['semester'].find((n) => n === c.name)))" :key="col.name"
            :props="props">
            <q-btn class="cellBTN" flat align="left" @click="open(props.row._id)">
              {{ col.value }}
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
// **********************************************子版清單***
const articles = inject('articles')
const init = inject('init')
const hasArticle = inject('hasArticle')
const articleRule = inject('articleRule')
// ----------
const filter = ref('')
const pagination = ref({ rowsPerPage: 20 })
const columns = reactive([
  {
    name: 'userScore',
    required: true,
    label: '作者分數',
    align: 'left',
    field: row => (row.user.score ? row.user.score : ''),
    // 似乎在header設就好
    // classes: 'q-table--col-auto-width',
    headerClasses: 'q-table--col-auto-width'
  },
  { name: 'review', align: 'left', label: '評分', field: row => row.score, sortable: true, sortOrder: 'da', headerClasses: 'q-table--col-auto-width' },
  { name: 'semester', align: 'left', label: '學期', field: row => row.uniqueId, sortable: true, sortOrder: 'da' }
]
)
const open = (url) => {
  router.push(url)
  init(url)
}
// **********************************************子文章清單***
// 要去母版看規則

</script>
<style lang="sass">
.q-page
  min-height: 0 !important
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

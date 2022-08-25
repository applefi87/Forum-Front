<template>
  <q-page class="flex flex-center">
    <q-table :rows="articles" :columns="columns" row-key="_id" :virtual-scroll="pagination.rowsPerPage === 0"
      v-model:pagination="pagination" auto-width no-data-label="無資料" grid-header
      :rows-per-page-options="[0, 10, 15, 20, 30, 40, 50, 80, 100]" style="height: 700px ;width:900px">
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props" class="">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <button class="cellBTN" @click="props.expand = !props.expand">
              <div v-if="col.name === 'userScore'"
                style="display:flex;flex-direction: column;justify-content: space-between; height: 100% ">
                {{ props.row.user.nickName }}
                <br>
                &nbsp; {{ col.value || '白紙用戶' }}
              </div>
              <div v-else-if="col.name === 'review'">
                <p class="tableTitle">{{ props.row.title }}</p>
                <br>
                {{ col.value }}
                <div class=" tag" v-for="t in (props.row.tags || ['涼', '甜', '閒'])" :tag="t" :key="t">
                  {{ t }}
                </div>
              </div>
              <div v-else-if="col.name === 'semester'" style="text-align: left;">
                {{ col.value }}
              </div>
            </button>
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%">
            <div class="text-left">{{ props.row.content }}</div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script setup scoped>
import { api } from 'src/boot/axios'
import { useRouter } from 'vue-router'
import { ref, reactive, inject, computed } from 'vue'
import { useI18n } from 'vue-i18n'
const router = useRouter()
const { t } = useI18n()
// **********************************************子版清單***
const board = inject('board')
const articles = inject('articles')
const hasArticle = inject('hasArticle')
// ----------
const filter = ref('')
const pagination = ref({ rowsPerPage: 20 })
const columns = reactive([
  {
    name: 'userScore',
    required: true,
    label: '作者分數',
    align: 'left',
    field: row => row.user.record.toBoard.score || '',
    // 似乎在header設就好
    // classes: 'q-table--col-auto-width',
    headerClasses: 'q-table--col-auto-width'
  },
  { name: 'review', align: 'left', label: '評分', field: row => row.score, sortable: true, sortOrder: 'da', headerClasses: 'q-table--col-auto-width' },
  // 把unique的id對應到版的uniqueData清單，抓取學期出來供排序
  {
    name: 'semester',
    align: 'left',
    label: '學期',
    field: row => {
      const unique = board.uniqueData.find(i => i._id === row.uniqueId)
      // console.log(row.uniqueId)
      // console.log(board.uniqueData)
      // console.log(unique)
      return unique.c80
    },
    sortable: true,
    sortOrder: 'da'
  }])
// **********************************************子文章清單***
// 要去母版看規則

</script>
<style lang="sass" scoped>
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
  padding: 0
.q-tr:nth-child(4n+1) td:nth-child(n+2)
  background: #f8f8f8
// 奇偶行不同顏色
.q-tr:nth-child(4n+3) td
  background: #FFF8F3
.q-tr:nth-child(4n+3) td:nth-child(n+2)
  background: #FAF3EF
.q-tr:nth-child(4n) td
  background: #FFF8F3
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

</style>

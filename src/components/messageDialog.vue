<!-- 統一格式  -->
<template>
  <q-card id="msg">
    <!-- <q-card-section class="q-pb-none">
      title
    </q-card-section> -->

    <q-card-section v-if="article.datas.length > 0" class="q-pa-none" style="max-height:70vh;overflow-y:scroll;">
      <!-- <q-table :rows="p.form.datas" :columns="columns" row-key="id" virtual-scroll=true separator="none" hide-header
        flat hide-pagination>
        <template v-slot:body="props">
          <q-tr :props="props" auto-width no-hover>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <button v-if="col.name === 'user'" class="cellBTN"
                @click="showUserInfo(col.value, props.row.user.record.toBoard.score, props.row.user.record.toBoard.amount, props.row.user.record.toBoard.scoreChart)">
                {{ col.value || t('anonymous') }}
              </button>
              <div v-else-if="col.name === 'content'"
                style="text-align: left; display:flex;justify-content: space-between; height:100%">
                <div v-html="col.value"></div>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table> -->
      <q-list ref="msgBox">
        <q-item v-for="msg in article.datas" :key="msg.createdAt">
          <q-item-section avatar>
            <q-avatar rounded>
              <q-icon v-if="msg.user.nickName === 'originalPoster'" name="home" />
              <img v-else :src="'https://source.boringavatars.com/beam/120/' + msg.user.nickName">
            </q-avatar>
          </q-item-section>
          <q-item-section>
            {{  msg.user.nickName === 'originalPoster' ? t('originalPoster') : (msg.user.nickName || t('anonymous'))  }}
            <br>
            {{  msg.content  }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <q-card-section v-else>{{  t('writeAComment')  }}
    </q-card-section>
    <hr>
    <q-card-section class="q-pt-none">
      <q-select v-if="!article.isSelf" borderless v-model="form.privacy" :options="privacyOptions" dense
        style="width:150px">
        <template v-slot:before>
          <p style="font-size: 0.8rem;color: black; margin: 0"> {{  t('privacy')  }}:</p>
        </template>
      </q-select>
      <q-input filled v-model="form.content" :placeholder="t('writeAComment')" dense
        @keydown.enter="users.token ? send() : loginState = true">
        <template v-slot:after>
          <q-btn v-if="users.token" @click="send" round dense flat icon="send" />
          <q-btn v-else @click="loginState = true" round dense flat icon="send" />
        </template>
      </q-input>
    </q-card-section>
  </q-card>
  <!-- <q-dialog v-model="userInfoState">
    <chartInfo :form="userInfoForm" />
  </q-dialog> -->
</template>

<script setup >
import { useUserStore } from 'src/stores/user'
import { ref, reactive, computed, inject, nextTick } from 'vue'
import { apiAuth } from 'src/boot/axios'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
const msgBox = ref(null)
const loginState = inject('loginState')
const { t } = useI18n()
const article = inject('article')
const articles = inject('articles')
// const p = defineProps({
//   article: Object
// })
const e = defineEmits(['update:article'])
const route = useRoute()
const router = useRouter()
const users = useUserStore()
const privacyOptions = computed(() => {
  return [
    { label: t('anonymous'), value: 0 },
    { label: t('showAll'), value: 1 }
  ]
})
// 請預設給匿名，這樣匿名發文者不用選，就會是匿名id
const form = reactive({ content: '', privacy: privacyOptions.value[0] })
const send = async function () {
  if (form.content === '') return
  const submit = { content: form.content, privacy: form.privacy.value }
  try {
    const { data } = await apiAuth.post('/article/createMsg/' + article._id, submit)
    article.datas = data.result.msg1.list
    const idx = articles.findIndex(it => it._id === article._id)
    if (idx >= 0) {
      // console.log(article)
      articles[idx] = data.result
    }
    nextTick(() => {
      msgBox.value.$el.scrollIntoView(false, { behavior: 'smooth' })
    })
  } catch (error) {
    console.log(error)
  }
}
// const userInfoState = ref(false)
// const userInfoForm = reactive({ titleCol: '用戶', title: '', averageTitle: '給評平均', chartTitle: '評分總覽', score: 0, amount: 0, datas: [] })
// const showUserInfo = (title, score, amount, datas) => {
//   userInfoForm.title = title
//   userInfoForm.score = score
//   userInfoForm.amount = amount
//   userInfoForm.datas.length = 0
//   userInfoForm.datas.push(...datas)
//   userInfoState.value = true
// }
</script>

<style lang="sass" scoped>
.q-card
  min-width:300px
.q-list
  padding-top: 10px
#msg td
  height: auto
  min-height: 50px
  margin-bottom: 20px
td:first-child
  width: 50px
  padding: 0
td:last-child
  border-radius: 15px
  padding: 5px
  background: #ccc
</style>

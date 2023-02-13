<template >
  <q-toolbar>
    <q-btn v-if="leftDrawerActive" class="lt-md" dense flat round icon="menu" @click="toggleLeftDrawer" />
    <q-toolbar-title class="q-pl-none" style="padding-bottom: 10px">
      <q-btn flat @click="router.push('/home')">
        <q-avatar class="gt-sm q-mr-sm">
          <img src="https://img.icons8.com/ios/100/FFFFFF/storytelling.png">
        </q-avatar>
        {{ t('home') }}
      </q-btn>
    </q-toolbar-title>
    <div class="q-pa-md">
      <q-btn-dropdown dense flat dropdown-icon="notifications">
        <q-list>
          <q-item clickable v-close-popup v-for="it of users.notification" :key="it.time">
            <router-link :to="`/board/${it.board._id}?article=${it.article}&msg1=${it.msg1}&action=${it.action}`"
              class="btnLink" target="_blank">
              <div> <b>{{ it.user.nickName }}</b>回應了{{ it.action }}
                <!-- {{ it.targetTitleCol[langWord] }} -->
                你對<b>{{
                (it.board.titleCol ? it.board.titleCol[langWord] :
                  it.board.colData[it.board.parent.childBoard.rule.titleCol[langWord]]).slice(0, 20)
                }}</b>的{{ it.type }}評價<br />
                {{ it.detail }}<br />
                {{
                  new Intl.DateTimeFormat("chinese", {
                    dateStyle: 'full', timeStyle: 'long'
                  }).format(new Date(it.time))
                }}<br />
              </div>
            </router-link>
            <!-- <q-item-section>
              <q-item-label>Photos</q-item-label>
            </q-item-section> -->
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
    <q-select class="langSelect gt-md" v-model="locale" :options="localeOptions" label="Language:" borderless emit-value
      map-options />
    <!-- https://quasar.dev/vue-components/button-dropdown -->
    <q-btn-dropdown v-if="users.token" class="info " dense flat :label='t("userInfo")' no-caps>
      <div class="row no-wrap q-pa-md">
        <q-btn :label='t("changePassword")' color="primary" flat class="q-ml-sm" to="/changePWD" />
      </div>
      <div class="row no-wrap q-pa-md">
        <q-btn :label='t("logout")' color="primary c-w" @click="logout" flat class="q-ml-sm" no-caps />
      </div>
      <b>{{ t('contactMe') }} <br>applefi87@gmail.com</b>
    </q-btn-dropdown>
    <q-btn-dropdown v-else class="login" dense flat icon="login" :label='t("login")' dropdown-icon="none"
      v-model="loginState">
      <div class="row no-wrap q-pa-md">
        <div class="column">
          <q-form @submit.prevent="login" class="q-gutter-xs loginBox">
            <q-input filled v-model="loginForm.account" :label='t("account")' lazy-rules :rules="accountVal"
              autocomplete="username" />
            <q-input filled v-model="loginForm.password" :label='t("password")' lazy-rules :rules="passwordVal"
              :type="isPwd ? 'password' : 'text'" autocomplete="password">
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="isPwd = !isPwd" />
              </template>
            </q-input>
            <div>
              <div style="height:40px">
                <!-- <q-checkbox v-model="loginForm.keepLogin" :label='t("keepLogin")' size="xs" color="green" /> -->
                <q-btn :label="t('forgetPWD')" type="submit" color="primary" class="f-r" flat to="/forgetPWD" />
              </div>
              <q-btn :label='t("login")' type="submit" color="primary" />
              <q-btn :label='t("register")' color="primary" flat class="q-ml-sm" @click="registerState = true" />
            </div>
          </q-form>
        </div>
      </div>
    </q-btn-dropdown>
    <q-btn class="lt-lg" dense flat round icon="settings" @click="toggleRightDrawer" />
  </q-toolbar>
  <!-- 註冊對話框 -->
  <registerDialog></registerDialog>
</template>

<script setup>
import { ref, reactive, watch, inject, provide } from 'vue'
import registerDialog from 'src/components/registerDialog.vue'
import { useQuasar } from 'quasar'
import notify from 'src/utils/notify'
import { useI18n } from 'vue-i18n'
import { useUserStore } from 'src/stores/user'
import { useRouter } from 'vue-router'
import { accountVal, passwordVal } from 'src/utils/data/valList.js'
const router = useRouter()
const users = useUserStore()
// ****
const langWord = inject('langWord')
const leftDrawerState = inject('leftDrawerState')
const rightDrawerState = inject('rightDrawerState')
const loginState = inject('loginState')
const registerState = ref(false)
defineProps(['leftDrawerActive'])
// *********************************************************************Header
// 增加多國語言可選+讀取預設語言
const isPwd = ref(true)

const localeOptions = [
  { value: 'en-US', label: 'English' },
  { value: 'zh-TW', label: '繁體中文' }
]

const { locale, t } = useI18n({ useScope: 'global' })
if (!users.local) users.local = useQuasar().lang.getLocale()
locale.value = users.local
watch(locale, () => {
  users.local = locale.value
})
// 切換左右選單顯示
const toggleLeftDrawer = () => {
  leftDrawerState.value = !leftDrawerState.value
}
const toggleRightDrawer = () => {
  rightDrawerState.value = !rightDrawerState.value
}
// ********************
const loginForm = reactive({ account: '', password: '' })
// ****************登陸****
const login = async () => {
  try {
    const rep = await users.login(loginForm)
    notify(rep)
    if (rep.success) {
      window.location.reload()
      loginForm.account = ''
      loginForm.password = ''
    }
  } catch (error) {
    // console.log(error.response?.data)
  }
}
//* ***************登出****
const logout = async () => {
  try {
    const rep = await users.logout()
    notify(rep)
  } catch (error) {
    // console.log(error)
  }
  // console.log('del')
  window.location.reload()
}

provide('registerState', registerState)
// *********************************************子文章************************
</script>
<style lang="sass" scoped >
.f-r
  float: right
.c-w
  &:deep(.block)
    color: black
.langSelect
  width: 100px
  &:deep() *
    color: white
// 避免預設btn變全大寫
.q-btn:deep( >.q-btn__content >.block)
  text-transform: capitalize
.loginBox
  width: 250px
//
.btnLink
  max-width: 300px
  width: 100%
  height: 100%
  cursor: pointer
  text-decoration: none
  &>div
    color: black
    white-space: nowrap
    text-overflow: ellipsis
    text-align: center

</style>

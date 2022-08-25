<template >
  <q-toolbar>
    <q-btn v-if="leftDrawerActive" class="lt-md" dense flat round icon="menu" @click="toggleLeftDrawer" />
    <q-toolbar-title class="q-pl-none">
      <q-btn flat @click="router.push('/board/6305df25f302b171b210ad66')">
        <q-avatar class="gt-sm q-mr-sm">
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
        </q-avatar>
        {{ t('home') }}
      </q-btn>
    </q-toolbar-title>
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
    </q-btn-dropdown>
    <q-btn-dropdown v-else class="login" dense flat icon="login" :label='t("login")' dropdown-icon="none"
      v-model="loginState">
      <div class="row no-wrap q-pa-md">
        <div class="column">
          <q-form @submit.prevent="login" class="q-gutter-xs">
            <q-input filled v-model="loginForm.account" :label='t("account")' lazy-rules
              :rules="[val => val && val.length > 0 || t('cantNull')]" autocomplete="username" />
            <q-input filled v-model="loginForm.password" :label='t("password")' lazy-rules
              :rules="[val => val && val.length > 0 || t('cantNull')]" :type="isPwd ? 'password' : 'text'"
              autocomplete="password">
              <template v-slot:append>
                <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                  @click="isPwd = !isPwd" />
              </template>
            </q-input>
            <div>
              <div style="height:50px">
                <q-checkbox v-model="loginForm.keepLogin" :label='t("keepLogin")' size="xs" color="green" />
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
const router = useRouter()
const users = useUserStore()
// ****
const leftDrawerState = inject('leftDrawerState')
const rightDrawerState = inject('rightDrawerState')
const registerState = ref(false)
defineProps(['leftDrawerActive'])
// *********************************************************************Header
// 增加多國語言可選+讀取預設語言
const isPwd = ref(true)
const loginState = ref(false)
const localeOptions = [
  { value: 'en-US', label: 'English' },
  { value: 'zh-TW', label: '繁體中文' }
]

const { locale, t } = useI18n({ useScope: 'global' })
locale.value = users.local || useQuasar().lang.getLocale()
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
const loginForm = reactive({ account: 'testadmin', password: 'testadminA0', keepLogin: false })
// ****************登陸****
const login = async () => {
  const rep = await users.login(loginForm)
  notify(rep)
  if (rep.success) {
    loginForm.account = ''
    loginForm.password = ''
    loginForm.keepLogin = false
    router.push('/')
  }
}
//* ***************登出****
const logout = async () => {
  const rep = await users.logout()
  notify(rep)
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
</style>

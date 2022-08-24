<template >
  <q-layout view="hHh lpR fff" id="m">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-btn flat @click="router.push('/board/6304cb253e13789077e47578')">
            <q-avatar class="gt-sm  q-mr-sm">
              <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
            </q-avatar>
            師大課程版首頁
          </q-btn>
        </q-toolbar-title>
        <q-select class="langSelect gt-md" v-model="locale" :options="localeOptions" label="Language:" borderless
          emit-value map-options />
        <!-- https://quasar.dev/vue-components/button-dropdown -->
        <q-btn-dropdown v-if="users.token" class="info " dense flat label='個人資料'>
          <div class="row no-wrap q-pa-md">
            <q-btn label='變更密碼' color="primary" flat class="q-ml-sm" to="/changePWD" />
          </div>
          <div class="row no-wrap q-pa-md">
            <q-btn :label='t("logout")' color="primary c-w" @click="logout" flat class="q-ml-sm" />
          </div>
        </q-btn-dropdown>
        <q-btn-dropdown v-else class="login" dense flat icon="login" :label='t("login")' dropdown-icon="none"
          v-model="loginDropdownState">
          <div class="row no-wrap q-pa-md">
            <div class="column">
              <q-form @submit.prevent="login" class="q-gutter-xs">
                <q-input filled v-model="loginForm.account" :label='t("account")' lazy-rules
                  :rules="[val => val && val.length > 0 || t('cantNull')]" />
                <q-input filled v-model="loginForm.password" :label='t("password")' lazy-rules
                  :rules="[val => val && val.length > 0 || t('cantNull')]" :type="isPwd ? 'password' : 'text'">
                  <template v-slot:append>
                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                      @click="isPwd = !isPwd" />
                  </template>
                </q-input>
                <div>
                  <div style="height:50px">
                    <q-checkbox v-model="loginForm.keepLogin" :label='t("keepLogin")' size="xs" color="green" />
                    <q-btn label="忘記密碼?" type="submit" color="primary" class="f-r" flat to="/forgetPWD" />
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
    </q-header>
    <!--  -->
    <q-drawer v-model='rightDrawerState' side="right" bordered :width="300" no-swipe-open no-swipe-close>
      <q-select v-model="locale" :options="localeOptions" label="Language:" borderless emit-value map-options />
    </q-drawer>
    <!-- ******************************************************** -->
    <q-page-container>
      <router-view />
    </q-page-container>
    <!--****************** 彈出視窗 ------>
    <!-- 註冊對話框 -->
    <registerDialog></registerDialog>
  </q-layout>
</template>

<script setup>
import { ref, reactive, provide } from 'vue'
import registerDialog from 'src/components/registerDialog.vue'
import { useQuasar } from 'quasar'
import notify from 'src/utils/notify'
import { useI18n } from 'vue-i18n'
import { useUserStore } from 'src/stores/user'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const users = useUserStore()
// *********************************************************************Header
// 增加多國語言可選+讀取預設語言
const isPwd = ref(true)
const registerState = ref(false)
const loginDropdownState = ref(false)
const localeOptions = [
  { value: 'en-US', label: 'English' },
  { value: 'zh-TW', label: '繁體中文' }
]
const { locale, t } = useI18n({ useScope: 'global' })
locale.value = useQuasar().lang.getLocale()

// 切換右選單顯示
const rightDrawerState = ref(false)
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
    router.push('/board/')
  }
}

//* ***************登出****
const logout = async () => {
  const rep = await users.logout()
  notify(rep)
}

provide('registerState', registerState)
provide('loginDropdownState', loginDropdownState)

</script>

<style lang="sass" scoped >
.q-header
  height: 48px
//
.langSelect
  width: 100px
  &:deep() *
    color: white
.f-r
  float: right
.c-w
  &:deep(.block)
    color: black
</style>
<!-- login 待處理同IP登陸5次要等15分鐘 (目前可一直試) -->

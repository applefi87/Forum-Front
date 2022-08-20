<template >
  <h4>管理員登入頁面</h4>
  <q-select class="langSelect" v-model="locale" :options="localeOptions" label="Language:" borderless emit-value
    map-options />
  <hr>
  <q-form @submit.prevent="login" class="q-gutter-xs">
    <q-input filled v-model="loginForm.account" :label='t("account")' lazy-rules
      :rules="[val => val && val.length > 0 || t('cantNull')]" />
    <q-input filled v-model="loginForm.password" :label='t("password")' lazy-rules
      :rules="[val => val && val.length > 0 || t('cantNull')]" :type="isPwd ? 'password' : 'text'"> <template
        v-slot:append>
        <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
      </template></q-input>
    <div>
      <div style="height:50px">
        <q-checkbox v-model="loginForm.keepLogin" :label='t("keepLogin")' size="xs" color="green" />
        <q-btn label="忘記密碼?" type="submit" color="primary" class="f-r" flat to="/forgetPWD" />
      </div>
      <q-btn :label='t("login")' type="submit" color="primary" />
      <q-btn :label='t("register")' color="primary" flat class="q-ml-sm" @click="registerState = true" />
    </div>
  </q-form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useQuasar } from 'quasar'
import notify from 'src/utils/notify'
import { useI18n } from 'vue-i18n'
import { useUserStore } from 'src/stores/user'
import { useRouter } from 'vue-router'
const router = useRouter()
const users = useUserStore()
// *********************************************************************Header
// 增加多國語言可選+讀取預設語言
const localeOptions = [
  { value: 'en-US', label: 'English' },
  { value: 'zh-TW', label: '繁體中文' }
]
const { locale, t } = useI18n({ useScope: 'global' })
locale.value = useQuasar().lang.getLocale()

const isPwd = ref(true)
if (users.token) {
  notify({ title: '已登入', text: '請先登出' })
  router.push('/')
}
// ********************
const loginForm = reactive({ account: 'testadmin', password: 'testadminA0', keepLogin: false, role: 0 })
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
// *********************************************子文章************************

</script>

<style lang="sass" scoped >
.q-header
  height: 48px
.langSelect
  width: 100px
  & *
    color: white
.gender
  margin-bottom: 0
  font-size: 0.8rem
.q-stepper
  width: 500px
  height: 600px
  position: relative
  &:deep(.q-stepper__nav)
    position: absolute
    bottom: 0
  &:deep(.q-field)
    margin-top: 0.6rem
.q-stepper__nav
  width: 100%
.f-r
  float: right
.c-w
  &:deep(.block)
    color: white
</style>
<!-- login 待處理同IP登陸5次要等15分鐘 (目前可一直試) -->

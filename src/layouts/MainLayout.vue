<template >
  <q-layout view="hHh LpR fff" id="m">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn class="lt-md" dense flat round icon="menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          Leasure
        </q-toolbar-title>
        <q-select class="langSelect" v-model="locale" :options="localeOptions" label="Language:" borderless emit-value
          map-options />
        <!-- https://quasar.dev/vue-components/button-dropdown -->
        <div class="q-pa-md">
          <q-btn-dropdown class="login" dense flat icon="login" :label='t("login")' dropdown-icon="none">
            <div class="row no-wrap q-pa-md">
              <div class="column">
                <q-form @submit.prevent="login" class="q-gutter-xs">
                  <q-input filled v-model="loginForm.account" :label='t("account")' lazy-rules
                    :rules="[val => val && val.length > 0 || t('cantNull')]" />
                  <q-input filled v-model="loginForm.password" :label='t("password")' lazy-rules
                    :rules="[val => val && val.length > 0 || t('cantNull')]" />
                  <div>
                    <div>
                      <q-checkbox v-model="loginForm.keepLogin" :label='t("keepLogin")' size="xs" color="green" />
                    </div>
                    <q-btn :label='t("login")' type="submit" color="primary" />
                    <q-btn :label='t("register")' color="primary" flat class="q-ml-sm" @click="register = true" />
                  </div>
                </q-form>
              </div>
            </div>
          </q-btn-dropdown>
        </div>
        <q-btn class="lt-lg" dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>

    </q-header>
    <q-drawer v-model='leftDrawerState' side="left" mini-to-overlay persistent bordered show-if-above :breakpoint="767"
      :width="300">

    </q-drawer>
    <q-drawer v-model='rightDrawerState' side="right" mini-to-overlay persistent bordered
      show-if-above:breakpoint="1023" :width="300">
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          <div>Title</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
    <!--****************** 彈出視窗 ------>
    <!-- 註冊對話框 -->
    <q-form @submit="onSubmit" class="q-gutter-xs">
      <q-dialog v-model="register" persistent>

        <q-stepper v-model="step" ref="stepper" color="primary" animated class="aaa" done-color="green">
          <q-step :name="0" :title='t("register")' icon="regidter" :done="step > 0">
            <q-card-section>
              <div class="text-h4">{{ t("register") }}</div>
              <div class="text-h6">{{ t("onlyStudent") }}</div>
            </q-card-section>
            <!-- <p class="text-h6">1.可選匿名 <br>2.評價依照課程名保存，更好查閱 <br>3.好的評價置頂 <br>4.評價越受歡迎，帳號分數越高</p> -->
          </q-step>
          <!--  -->
          <q-step :name="1" title="驗證學校信箱" icon="email" :done="step > 1">
            <q-card-section class="q-pt-none">
              <q-input filled v-model="registerForm.schoolEmail" :label='t("schoolEmail")' lazy-rules
                :rules="[val => val && val.length > 0 || t('cantNull')]" />
              <q-btn dense flat rounded :loading="mailSending" @click="sendMail(false)" label="寄驗證信"> <template
                  v-slot:loading>
                  <q-spinner-radio />
                </template></q-btn>
              <q-input filled v-model="registerForm.schoolEmailCode" :label='t("schoolEmailCode")' lazy-rules
                :rules=schoolEmailVal />
              <div>
              </div>
            </q-card-section>
          </q-step>
          <!--  -->
          <q-step :name="2" title="帳密" icon="settings" :done="step > 2">
            <q-card-section class="q-pt-none">
              <q-input filled v-model="registerForm.account" :label='t("account")' lazy-rules
                :rules="[val => val && val.length > 0 || t('cantNull')]" />
              <q-input filled v-model="registerForm.password" :label='t("password")' :hint='t("pwdRule")' lazy-rules
                :rules="[val => val && val.length > 0 || t('cantNull')]" />
              <q-input filled v-model="registerForm.passwordCheck" :label='t("pwdCheck")' lazy-rules
                :rules="[val => val && val.length > 0 || t('pwdCheckFail')]" />
              <p class="gender">Gender:</p>
              <div class="q-gutter-sm">
                <q-radio v-model="registerForm.gender" val=1 :label='t("Male")' />
                <q-radio v-model="registerForm.gender" val=2 :label='t("Female")' />
                <q-radio v-model="registerForm.gender" val=0 :label='t("Others")' />
              </div>
            </q-card-section>
          </q-step>
          <template v-slot:navigation>
            <q-stepper-navigation>
              <q-btn @click="$refs.stepper.next()" color="primary" :label="step === 4 ? 'Finish' : 'Continue'" />
              <q-btn v-if="step > 0" flat color="primary" @click="$refs.stepper.previous()" label="Back"
                class="q-ml-sm" />
              <q-btn v-if="step > 3" class="q-ml-sm" :label='t("register")' color="primary" flat
                @click="register = true" />
            </q-stepper-navigation>
          </template>
        </q-stepper>
      </q-dialog>
    </q-form>
    <!-- 註冊對話框 -->
    <q-dialog v-model="alertState">
      <q-card :style="{
        'background': alertMsg.success ? 'green' : 'red', 'color': 'white'
      }">
        <q-card-section v-if="alertMsg.title">
          <div class="text-h6">{{ alertMsg.title }}</div>
        </q-card-section>
        <q-card-section v-if="alertMsg.text.length > 0" class="q-pt-none">{{ alertMsg.text }}</q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useUserStore } from 'src/stores/user'
const users = useUserStore()

// 增加多國語言可選+讀取預設語言
const localeOptions = [
  { value: 'en-US', label: 'English' },
  { value: 'zh-TW', label: '繁體中文' }
]
const { locale, t } = useI18n({ useScope: 'global' })
locale.value = useQuasar().lang.getLocale()
// 初始變數
const register = ref(false)
const step = ref(1)
const alertState = ref(false)
const alertMsg = reactive({ success: false, title: '', text: '', second: 1 })
// 切換左右選單顯示
const leftDrawerState = ref(false)
const rightDrawerState = ref(false)
const toggleLeftDrawer = () => {
  leftDrawerState.value = !leftDrawerState.value
}
const toggleRightDrawer = () => {
  rightDrawerState.value = !rightDrawerState.value
}
// 登入/註冊驗證功能
const schoolEmailVal = [
  val => (val !== null && val !== '') || 'Please type your age',
  val => (val > 0 && val < 100) || 'Please type a real age',
  val => (val && val.length > 0) || t('schoolEMailCodeFail')
]
const loginForm = reactive({ account: '', password: '', keepLogin: false })
const registerForm = reactive({ schoolEmail: '', schoolEmailCode: '', account: '', password: '', passwordCheck: '', gender: '0' })
const alert = (info) => {
  alertMsg.success = info.success
  alertMsg.title = info.title
  alertMsg.text = info.text
  alertState.value = true
  setInterval(() => {
    alertState.value = false
  }, (info.duration ? info.duration : 2) * 1000)
}
// login
const login = async () => {
  const rep = await users.login(loginForm)
  alert(rep)
}

// 寄email
const mailSending = ref(false)
const sendMail = async (school) => {
  const rep = await users.sendMail(registerForm.schoolEmail, school)
  alert(rep)
}
const onSubmit = () => { }

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

</style>
<!-- login 待處理同IP登陸5次要等15分鐘 (目前可一直試) -->

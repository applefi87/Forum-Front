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
    <form class="q-gutter-md">
      <q-dialog v-model="registerState" persistent>
        <q-stepper v-model="step" ref="stepper" color="primary" animated class="aaa" done-color="green">
          <q-step :name="1" :title='t("register")' icon="regidter" :done="step > 1">
            <q-card-section>
              <div class="text-h4">{{ t("register") }}</div>
              <div class="text-h6">{{ t("onlyStudent") }}</div>
            </q-card-section>
            <!-- <p class="text-h6">1.可選匿名 <br>2.評價依照課程名保存，更好查閱 <br>3.好的評價置頂 <br>4.評價越受歡迎，帳號分數越高</p> -->
          </q-step>
          <!--  -->
          <q-step :name="2" title="驗證學校信箱" icon="email" :done="step > 2">
            <q-card-section class="q-pt-none">
              <q-input ref=emailFormatValid filled v-model="registerForm.schoolEmail" :label='t("schoolEmail")'
                :rules="emailVal(false)" />
              <q-btn dense flat rounded :loading="mailSending" @click="sendMail(true)" label="寄驗證信"> <template
                  v-slot:loading>
                  <q-spinner-radio />
                </template>
              </q-btn>
              <q-input filled v-model="registerForm.schoolEmailCode" :label='t("schoolEmailCode")' :rules="mailCodeVal"
                ref=mailCodeValid />
              <q-btn dense flat rounded :loading="mailVerifying" @click="mailVerify()" label="驗證">
                <template v-slot:loading>
                  <q-spinner-radio />
                </template>
              </q-btn>
            </q-card-section>
          </q-step>
          <!--  -->
          <q-step :name="3" title="帳密" icon="settings" :done="step > 3">
            <q-card-section class="q-pt-none">
              <q-input filled v-model="registerForm.account" :label='t("account")' :rules="accountVal"
                ref=accountValid />
              <q-input filled v-model="registerForm.password" :label='t("password")' :hint='t("pwdRule")'
                :type="isPwd ? 'password' : 'text'" :rules="passwordVal"><template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                    @click="isPwd = !isPwd" />
                </template></q-input>
              <q-input filled v-model="registerForm.nickName" label='nickName' :rules="nickNameVal" ref=nickNameValid />
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
              <q-btn v-if="step < 3" @click="$refs.stepper.next()" color="primary" label="Continue" />
              <q-btn v-else @click="register" color="primary" label="register" />
              <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back"
                class="q-ml-sm" />
            </q-stepper-navigation>
          </template>
        </q-stepper>
      </q-dialog>
    </form>
    <!-- Alert對話框 -->
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
const registerState = ref(true)
const step = ref(3)
const alertState = ref(false)
const alertMsg = reactive({ success: false, title: '', text: '', second: 1 })
const isPwd = ref(true)
// 切換左右選單顯示
const leftDrawerState = ref(false)
const rightDrawerState = ref(false)
const toggleLeftDrawer = () => {
  leftDrawerState.value = !leftDrawerState.value
}
const toggleRightDrawer = () => {
  rightDrawerState.value = !rightDrawerState.value
}
// ***********rule val區******************************
const accountVal = reactive([
  val => (val && val.length >= 8 && val.length <= 30) || '長度需介於8~30字之間',
  val => val.match(/^[a-z0-9]+$/) || '只能輸入英文小寫與數字'
])

const passwordVal = reactive([
  val => (val && val.length >= 8 && val.length <= 30) || '長度需介於8~30字之間',
  val => (val.match(/[A-Z]/) && val.match(/[a-z]/) && val.match(/[0-9]/)) || '必須含英文大、小寫與數字',
  val => true || '預留給有同名使用'
])

const nickNameVal = reactive([
  val => (val && val.length >= 4 && val.length <= 20) || '長度需介於4~20字之間',
  val => true || '預留給有同名使用'
])
const mailCodeVal = reactive([
  val => (val.length === 6 && val.match(/^[0-9]+$/)) || '為六位數字',
  val => true || '預留給有同名使用'
])

const emailVal = (isSchool) => {
  const rule = [
    val => (val !== null && val !== '') || 'Please type your email',
    val => val.length <= 40 || '必須 40 個字以下'
  ]
  if (isSchool) {
    rule.push(
      // @後方必須含 .edu.
      // eslint-disable-next-line no-useless-escape
      val => val.match(/^[a-z0-9]+@[a-z0-9\.]+\.edu\.[a-z0-9\.]+$/) || '格式錯誤，必須為學校信箱')
  } else {
    rule.push(
      // eslint-disable-next-line no-useless-escape
      val => val.match(/^[a-z0-9]+@[a-z0-9]+\.[a-z0-9\.]+$/) || '格式錯誤，僅可含英小寫、數、@、.'
    )
  }
  return rule
}
// ********************
// 寄email
const emailFormatValid = ref(null)
const mailSending = ref(false)
const sendMail = async (isSchool) => {
  if (!emailFormatValid.value.validate()) return
  mailSending.value = true
  const rep = await users.sendMail(registerForm.schoolEmail, isSchool)
  await alert(rep)
  mailSending.value = false
}
// 驗證email
const mailVerifying = ref(false)
const mailCodeValid = ref(null)
const mailVerify = async () => {
  if (!mailCodeValid.value.validate()) return
  mailVerifying.value = true
  const rep = await users.mailVerify(registerForm.schoolEmail, registerForm.schoolEmailCode)
  await alert(rep)
  mailVerifying.value = false
}
// ********************
const loginForm = reactive({ account: '', password: '', keepLogin: false })
const registerForm = reactive({ schoolEmail: 'wdadad@efeafas.edu.tw', schoolEmailCode: '', account: 'efwdsfsfs', password: 'wdadawd66A', nickName: 'WDAWDAD', gender: '0' })
//
const alert = async (info) => {
  console.log(info)
  alertMsg.success = info.success
  alertMsg.title = info.title
  alertMsg.text = info.text ? info.text : ''
  alertState.value = true
  setTimeout(() => {
    alertState.value = false
  }, (info.duration ? info.duration : 2) * 1000)
}

// login
const login = async () => {
  const rep = await users.login(loginForm)
  alert(rep)
}

// ****************註冊****
const accountValid = ref(null)
const nickNameValid = ref(null)
const register = async () => {
  console.log(emailFormatValid)
  console.log(accountValid)
  // if (!(mailCodeValid.value.validate() && emailFormatValid.value.validate() && accountValid.value.validate() && nickNameValid.value.validate())) return
  // const rep = await users.register(registerForm)
  // alert(rep)
  // if (rep.accountOccupied) {
  //   accountVal[2] = val => val !== rep.account || '已經有相同帳號'
  // } else {
  //   accountVal[2] = val => true || ''
  // }
  // if (rep.NickNameOccupied) {
  //   nickNameVal[1] = val => val !== rep.nickName || '已經有相同名稱'
  // } else {
  //   nickNameVal[1] = val => true || ''
  // }
  // accountValid.value.validate()
  // nickNameValid.value.validate()
}

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

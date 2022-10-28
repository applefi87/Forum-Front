<template >
  <q-dialog v-model="registerState" persistent>
    <div>
      <q-form class="q-gutter-md" @submit.prevent="register()">
        <q-stepper v-model="step" ref="stepper" color="primary" animated class="aaa" done-color="green">
          <q-step :name="1" :title='t("register")' icon="regidter" :done="step > 1">
            <q-card-section>
              <div class="text-h4">{{ t("register") }}</div>
              <div class="text-h6">{{ t("registerFirst") }}</div>
            </q-card-section>
            <!-- <p class="text-h6">1.可選匿名 <br>2.評價依照課程名保存，更好查閱 <br>3.好的評價置頂 <br>4.評價越受歡迎，帳號分數越高</p> -->
          </q-step>
          <!--  -->
          <q-step :name="2" title="驗證學校信箱" icon="email" :done="step > 2">
            <q-card-section class="q-pt-none">
              <q-input ref="emailFormatValid" filled v-model="registerForm.schoolEmail" :label='t("email")'
                :rules="emailVal(true)" />
              <q-btn dense color="secondary" :loading="mailSending" @click="sendMail(true)" label="寄驗證信">
                <template v-slot:loading>
                  <q-spinner-radio />
                </template>
              </q-btn>
              <q-input filled v-model="registerForm.schoolEmailCode" :label='t("schoolEmailCode")' :rules="mailCodeVal"
                ref="mailCodeValid" />
            </q-card-section>
          </q-step>
          <!--  -->
          <q-step :name="3" title="帳密" icon="settings" :done="step > 3">
            <q-card-section class="q-pt-none">
              <q-input filled v-model="registerForm.account" :label='t("account")' :rules="accountVal"
                ref=accountValid />
              <q-input filled v-model="registerForm.password" :label='t("password")' :type="isPwd ? 'password' : 'text'"
                :rules="passwordVal"><template v-slot:append>
                  <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                    @click="isPwd = !isPwd" />
                </template></q-input>
              <q-input filled v-model="registerForm.nickName" :label='t("nickname")' :rules="nickNameVal"
                ref=nickNameValid />
              <!-- :hint="t('nickNameRules')" -->
              <p class="gender">Gender:</p>
              <div class="q-gutter-sm">
                <q-radio v-model="registerForm.gender" val=1 :label='t("male")' />
                <q-radio v-model="registerForm.gender" val=2 :label='t("female")' />
                <q-radio v-model="registerForm.gender" val=0 :label='t("others")' />
              </div>
            </q-card-section>
          </q-step>
          <template v-slot:navigation>
            <q-stepper-navigation>
              <q-btn v-if="step < 3" @click="nextPage()" color="primary" label="Continue" :loading="mailVerifying">
                <template v-slot:loading>
                  <q-spinner-radio />
                </template>
              </q-btn>
              <q-btn v-else type="submit" color="primary" label="register" />
              <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back"
                class="q-ml-sm" />
              <q-btn label='關閉' color="primary" flat class="q-ml-sm close-register" @click="registerState = false" />
            </q-stepper-navigation>
          </template>
        </q-stepper>
      </q-form>
    </div>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from 'src/stores/user'
import notify from '../utils/notify'
const isPwd = ref(true)
const { t } = useI18n()
const users = useUserStore()
// 初始變數
const registerState = inject('registerState')
const loginState = inject('loginState')
// ****************註冊****
const accountValid = ref(null)
const nickNameValid = ref(null)
// 寄email
const emailFormatValid = ref(null)
const mailSending = ref(false)
const sendMail = async (isSchool) => {
  try {
    if (!emailFormatValid.value.validate()) return
    mailSending.value = true
    const rep = await users.sendMail(registerForm.schoolEmail, isSchool)
    notify(rep)
    mailSending.value = false
  } catch (error) {
    console.log(error)
    notify(error.response.data)
  }
}
const step = ref(1)
const stepper = ref(null)
// 驗證email
const mailVerifying = ref(false)
const mailCodeValid = ref(null)
//
const emailVal = (isSchool) => {
  const rule = [
    val => (val !== null && val !== '') || 'Please type your email',
    val => val.length <= 40 || '必須 40 個字以下'
  ]
  if (isSchool) {
    rule.push(
      // @後方必須含 .edu.
      // val => val.match(/^[a-z0-9]+@[a-z0-9\.]+\.edu\.[a-z0-9\.]+$/) || '格式錯誤/必須為學校信箱')
      // 初期限制要有".edu.tw"結尾才行
      // eslint-disable-next-line no-useless-escape
      val => (/^[a-z0-9]+@[a-z0-9\.]+\.edu\.tw$/).test(val) || '格式錯誤，僅可含英小寫、數、@、./必須為學校信箱')
  } else {
    rule.push(
      // eslint-disable-next-line no-useless-escape
      val => (/^[a-z0-9]+@[a-z0-9]+\.[a-z0-9\.]+$/).test(val) || '格式錯誤，僅可含英小寫、數、@、.'
    )
  }
  return rule
}
const nextPage = async () => {
  try {
    if (step.value === 2) {
      if (!(mailCodeValid.value.validate() && emailFormatValid.value.validate())) return
      mailVerifying.value = true
      const rep = await users.mailVerify(registerForm.schoolEmail, registerForm.schoolEmailCode)
      notify(rep)
      mailVerifying.value = false
      if (rep.success) { step.value++ } else { return }
    }
    stepper.value.next()
  } catch (error) {
    console.log(error.response.data)
    notify(error.response.data)
  }
}
// ********************

const registerForm = reactive({ schoolEmail: '', schoolEmailCode: '', account: '', password: '', nickName: '', gender: '0' })

// ***********rule val區******************************
const accountVal = [
  val => (val && val.length >= 4 && val.length <= 30) || '長度需介於4~30字之間',
  // 簡易版
  // val => (val && val.length >= 8 && val.length <= 30) || '長度需介於8~30字之間',
  val => (/^[a-z0-9]+$/).test(val) || '只能輸入英文小寫與數字'
]
const passwordVal = [
  val => (val && val.length >= 8 && val.length <= 30) || '長度需介於8~30字之間',
  // 先改成簡易密碼 必須有英數就好
  val => ((/[a-zA-Z]/).test(val) && (/[0-9]/).test(val)) || '必須含英文與數字',
  val => true || '預留給有同名使用，名稱重複會把這行換成不能等於原本帳號'
]
const nickNameVal = [
  val => (val && val.length >= 4 && val.length <= 20) || '長度需介於4~20字之間',
  val => (['originalPoster', 'you', 'admin'].includes(val)) || '該暱稱不可使用',
  val => true || '預留給有同名使用'
]
const mailCodeVal = [
  val => (val.length === 6 && (/^[0-9]+$/).test(val)) || '為六位數字'
]
const register = async () => {
  try {
    const rep = await users.register(registerForm)
    notify(rep)
    if (rep.success) {
      registerState.value = false
      registerForm.schoolEmail = ''
      registerForm.schoolEmailCode = ''
      registerForm.account = ''
      registerForm.password = ''
      registerForm.nickName = ''
      registerForm.gender = '0'
      step.value = 1
      registerState.value = false
      loginState.value = false
      return
    }
    if (rep.accountOccupied) {
      accountVal[2] = val => val !== rep.account || '已經有相同帳號'
    } else {
      accountVal[2] = val => true || ''
    }
    if (rep.NickNameOccupied) {
      nickNameVal[2] = val => val !== rep.nickName || '已經有相同名稱'
    } else {
      nickNameVal[2] = val => true || ''
    }
    accountValid.value.validate()
    nickNameValid.value.validate()
  } catch (error) {
    console.log(error.response.data)
    notify(error.response.data)
  }
}

</script>

<style lang="sass" scoped>
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
</style>

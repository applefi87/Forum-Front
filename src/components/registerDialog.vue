<template >
  <q-dialog v-model="registerState" persistent>
    <div>
      <q-form class="q-gutter-md" @submit.prevent="register()">
        <q-stepper v-model="step" ref="stepper" color="primary" animated class="aaa" done-color="green">
          <q-step :name="1" :title='t("register")' icon="regidter" :done="step > 1">
            <q-card-section>
              <div class="text-h4">{{ t("register") }}</div>
              <div class="text-h6">{{ t("registerOnlySchool") }}applefi87@gmail.com</div>
            </q-card-section>
            <!-- <p class="text-h6">1.可選匿名 <br>2.評價依照課程名保存，更好查閱 <br>3.好的評價置頂 <br>4.評價越受歡迎，帳號分數越高</p> -->
          </q-step>
          <!--  -->
          <q-step :name="2" title="驗證學校信箱" icon="email" :done="step > 2">
            <q-card-section class="q-pt-none">
              <q-input ref="emailFormatValid" filled v-model="registerForm.schoolEmail" :label='t("email")'
                :rules="emailVal(mustSchool)" :hint="t('emailRule') + ' applefi87@gmail.com'" />
              <q-btn dense color="secondary" :loading="mailSending" @click="sendMail()" label="寄驗證信">
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
                ref=passwordValid :rules="passwordVal"><template v-slot:append>
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
              <q-btn v-if="step < 3" @click="nextPage()" color="primary" :label="t('continue')"
                :loading="mailVerifying">
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
import { accountVal, passwordVal, nickNameVal, mailCodeVal, emailVal } from 'src/utils/data/valList.js'
const mustSchool = true
const isPwd = ref(true)
const { t } = useI18n()
const users = useUserStore()
// 初始變數
const registerState = inject('registerState')
const loginState = inject('loginState')
// ****************註冊****
const accountValid = ref(null)
const passwordValid = ref(null)
const nickNameValid = ref(null)
// 寄email
const emailFormatValid = ref(null)
const mailSending = ref(false)
const sendMail = async () => {
  try {
    if (!emailFormatValid.value.validate()) return
    mailSending.value = true
    const rep = await users.sendMail(registerForm.schoolEmail, mustSchool)
    notify(rep)
    mailSending.value = false
  } catch (error) {
    // console.log(error)
    notify(error.response.data)
  }
}
const step = ref(1)
const stepper = ref(null)
// 驗證email
const mailVerifying = ref(false)
const mailCodeValid = ref(null)
//
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
    // console.log(error.response.data)
    notify(error.response.data)
  }
}
// ********************

const registerForm = reactive({ schoolEmail: '', schoolEmailCode: '', account: '', password: '', nickName: '', gender: '0' })

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
    // console.log(error.response.data)
    // notify(error.response.data)
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

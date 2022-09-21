<template>
  <q-page class="flex flex-center">
    <q-card-section v-if="!getTempPWD" class="q-pt-none">
      <q-form>
        <q-input ref="emailFormatValid" filled v-model="form.email" :label='t("email")' :rules="emailVal(false)"
          autocomplete="new-password" />
        <q-btn dense color="primary" :loading="mailSending" @click="sendPWDMail()" label="寄驗證信">
          <template v-slot:loading>
            <q-spinner-radio />
          </template>
        </q-btn>
        <q-input filled v-model="form.code" :label='t("schoolEmailCode")' :rules="mailCodeVal" ref="mailCodeValid" />
        <q-btn dense color="primary" :loading="mailVerifying" @click="verifyPWDMail()" label="驗證">
          <template v-slot:loading>
            <q-spinner-radio />
          </template>
        </q-btn>
      </q-form>
    </q-card-section>
    <q-card-section v-else class="q-pt-none">
      <p>{{ account }}您好</p>
      <p>以下為您的臨時密碼，請立刻登錄並更改密碼</p>
      <p>{{ tempPWD }}</p>
    </q-card-section>
  </q-page>
</template>

<script setup>

import { ref, reactive } from 'vue'
import { useUserStore } from 'src/stores/user'
import { useI18n } from 'vue-i18n'
import notify from 'src/utils/notify'
const { t } = useI18n({ useScope: 'global' })
const users = useUserStore()
const getTempPWD = ref(false)
const form = reactive({ email: '', code: '' })
const emailFormatValid = ref(null)
const mailSending = ref(false)
const account = ref('')
const tempPWD = ref('')
// ***********rule val區******************************
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
const mailCodeVal = reactive([
  val => (val.length === 10 && val.match(/^[0-9]+$/)) || '為十位數字',
  val => true || '預留給有同名使用'
])

const sendPWDMail = async () => {
  try {
    if (!emailFormatValid.value.validate()) return
    mailSending.value = true
    const rep = await users.sendPWDMail(form.email)
    notify(rep)
  } catch (error) {
    notify(error.response.data)
    console.log(error.response.data)
  }
  mailSending.value = false
}

// 驗證email
const mailVerifying = ref(false)
const mailCodeValid = ref(null)
const verifyPWDMail = async () => {
  try {
    console.log('in')
    if (!mailCodeValid.value.validate()) return
    mailVerifying.value = true
    const rep = await users.verifyPWDMail(form.email, form.code)
    notify(rep)
    getTempPWD.value = true
    account.value = rep.result.account
    tempPWD.value = rep.result.tempPWD
  } catch (error) {
    // notify(error.response.data)
    console.log(error.response.data)
  }
  mailVerifying.value = false
}
</script>

<style lang="sass" scoped>
.q-form
  width: 300px
.q-btn
  margin-bottom: 30px
</style>

<template>
  <q-page class="flex flex-center">
    <q-card-section v-if="!getTempPWD" class="q-pt-none">
      <h5><b>忘記密碼? <br>建議您直接重設密碼，可改回原密碼無限制</b></h5>
      <q-form>
        <q-input ref="accountFormatValid" filled v-model="form.account" :label='t("account")' :rules="accountVal"
          autocomplete="account" />
        <q-input ref="emailFormatValid" filled v-model="form.email" :label='t("email")' :rules="emailVal(false)"
          autocomplete="new-password" />
        <q-btn dense color="primary" :loading="mailSending" @click="sendForgetPWDMail()" label="寄驗證信">
          <template v-slot:loading>
            <q-spinner-radio />
          </template>
        </q-btn>
        <p v-if="identifier">批次:{{ identifier }}</p>
        <q-input filled v-model="form.code" :label='t("schoolEmailCode")' :rules="mailCodeVal" ref="mailCodeValid" />
        <q-btn dense color="primary" :loading="mailVerifying" @click="verifyForgetPWDCode()" label="驗證">
          <template v-slot:loading>
            <q-spinner-radio />
          </template>
        </q-btn>
      </q-form>
    </q-card-section>
    <q-card-section v-else class="q-pt-none">
      <h5><b>密碼重設成功，請至email查看新密碼</b></h5>
    </q-card-section>
  </q-page>
</template>

<script setup>
// 忘記密碼:
// 確認有申請>臨時code也有hash過>提供新密碼>自己重設

import { ref, reactive } from 'vue'
import { useUserStore } from 'src/stores/user'
import { useI18n } from 'vue-i18n'
import notify from 'src/utils/notify'
import { accountVal, emailVal, mailCodeVal } from 'src/utils/data/valList.js'
const { t } = useI18n({ useScope: 'global' })
const users = useUserStore()
const getTempPWD = ref(false)
const form = reactive({ email: '', account: '', code: '' })
const emailFormatValid = ref(null)
const accountFormatValid = ref(null)
const mailSending = ref(false)
const identifier = ref(null)
// ***********rule val區******************************

const sendForgetPWDMail = async () => {
  try {
    if (!(emailFormatValid.value.validate() && accountFormatValid.value.validate())) return
    mailSending.value = true
    const rep = await users.sendForgetPWDMail(form)
    identifier.value = rep?.identifier || null
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
const verifyForgetPWDCode = async () => {
  try {
    console.log('in')
    if (!mailCodeValid.value.validate()) return
    mailVerifying.value = true
    const rep = await users.verifyForgetPWDCode(form)
    notify(rep)
    if (!rep.success) throw new Error(rep.title)
    getTempPWD.value = true
  } catch (error) {
    // notify(error.response.data)
    console.log(error)
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

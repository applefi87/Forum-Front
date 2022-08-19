<template>
  <q-page class="flex flex-center">
    <q-card-section v-if="!pwdChanged" class="q-pt-none">
      <q-input filled v-model="form.password" :label='t("password")' :hint='t("pwdRule")'
        :type="isPwdOld ? 'password' : 'text'" :rules="passwordVal"><template v-slot:append>
          <q-icon :name="isPwdOld ? 'visibility_off' : 'visibility'" class="cursor-pointer"
            @click="isPwdOld = !isPwdOld" />
        </template></q-input>
      <q-input filled v-model="form.newPWD" :label='t("newPWD")' :hint='t("pwdRule")'
        :type="isPwdNew ? 'password' : 'text'" :rules="passwordVal"><template v-slot:append>
          <q-icon :name="isPwdNew ? 'visibility_off' : 'visibility'" class="cursor-pointer"
            @click="isPwdNew = !isPwdNew" />
        </template></q-input>
      <q-btn dense color="secondary" :loading="pwdVerifying" @click="changePWD()" label="驗證">
        <template v-slot:loading>
          <q-spinner-radio />
        </template>
      </q-btn>
    </q-card-section>
    <q-card-section v-else class="q-pt-none">
      <p>{{ account }}您好</p>
      <p>密碼變更成功，請使用新密碼重新登錄</p>
    </q-card-section>
  </q-page>
</template>

<script setup>

import { ref, reactive } from 'vue'
import notify from '../utils/notify'
import { useUserStore } from 'src/stores/user'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const pwdChanged = ref(false)
const pwdVerifying = ref(false)
const isPwdOld = ref(true)
const isPwdNew = ref(true)
const users = useUserStore()
const form = reactive({ password: '', newPWD: '' })
const account = ref('')

// ***********rule val區******************************
const passwordVal = reactive([
  val => (val && val.length >= 8 && val.length <= 30) || '長度需介於8~30字之間',
  val => (val.match(/[A-Z]/) && val.match(/[a-z]/) && val.match(/[0-9]/)) || '必須含英文大、小寫與數字',
  val => true || '預留給有同名使用'
])

const changePWD = async () => {
  pwdVerifying.value = true
  const rep = await users.changePWD(form)
  notify(rep)
  pwdVerifying.value = false
  if (rep.success) {
    users.token = ''
    users.account = ''
    users.role = 0
    router.push('/')
  }
}
</script>

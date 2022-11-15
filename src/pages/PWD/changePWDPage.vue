<template>
  <q-page class="flex flex-center">
    <q-form>
      <q-card-section v-if="!pwdChanged" class="q-pt-none">
        <q-input filled v-model="form.password" :label='t("password")' :hint='t("easyRule")'
          :type="isPwd ? 'password' : 'text'" :rules="passwordVal" autocomplete="password"><template v-slot:append>
            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
          </template></q-input>
        <q-input filled v-model="form.newPWD" :label='t("newPWD")' :hint='t("easyRule")'
          :type="isPwd ? 'password' : 'text'" :rules="passwordVal" autocomplete="new-password"><template v-slot:append>
            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
          </template></q-input>
        <q-btn dense color="primary" :loading="pwdVerifying" @click="changePWD()" label="驗證">
          <template v-slot:loading>
            <q-spinner-radio />
          </template>
        </q-btn>
      </q-card-section>
      <q-card-section v-else class="q-pt-none">
        <p>{{ account }}您好</p>
        <p>密碼變更成功，請使用新密碼重新登錄</p>
      </q-card-section>
    </q-form>
  </q-page>
</template>

<script setup>

import { ref, reactive } from 'vue'
import notify from 'src/utils/notify'
import { useUserStore } from 'src/stores/user'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { passwordVal } from 'src/utils/data/valList.js'
const router = useRouter()
const { t } = useI18n({ useScope: 'global' })
const pwdChanged = ref(false)
const pwdVerifying = ref(false)
const isPwd = ref(true)
const users = useUserStore()
const form = reactive({ password: '', newPWD: '' })
const account = ref('')

const changePWD = async () => {
  try {
    if (form.password === form.newPWD) return notify({ title: '新舊密碼不可相同' })
    pwdVerifying.value = true
    const rep = await users.changePWD(form)
    notify(rep)
    router.push('/')
  } catch (error) {
    notify(error.response.data)
    console.log(error.response.data)
  }
}
const init = () => {
  if (!users.token) router.push('/')
}
init()
</script>
<style lang="sass" scoped>
.q-input
  width: 300px
  max-width: 80vw !important
  margin-bottom: 30px
</style>

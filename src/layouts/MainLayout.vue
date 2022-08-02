<template >
  <q-layout view="hHh LpR fff">
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
          <q-btn-dropdown class="login" dense flat icon="login" @click="login" :label='t("login")' dropdown-icon="none">
            <div class="row no-wrap q-pa-md">
              <div class="column">
                <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-xs">
                  <q-input filled v-model="loginForm.account" :label='t("account")' lazy-rules
                    :rules="[val => val && val.length > 0 || t('cantNull')]" />
                  <q-input filled v-model="loginForm.password" :label='t("password")' lazy-rules
                    :rules="[val => val && val.length > 0 || t('cantNull')]" />
                  <div>
                    <div>
                      <q-checkbox v-model="loginForm.keepLogin" :label='t("keepLogin")' />
                    </div>
                    <q-btn :label='t("login")' type="submit" color="primary" />
                    <q-btn :label='t("register")' type="reset" color="primary" flat class="q-ml-sm" />
                  </div>
                </q-form>
              </div>
            </div>
          </q-btn-dropdown>
        </div>
        <q-btn class="lt-lg" dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
      <q-dialog v-model="prompt" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">Your address</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input dense v-model="address" autofocus @keyup.enter="prompt = false" />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn flat label="Add address" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
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

  </q-layout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'

// 增加多國語言可選+讀取預設語言
const localeOptions = [
  { value: 'en-US', label: 'English' },
  { value: 'zh-TW', label: '繁體中文' }
]
const { locale, t } = useI18n({ useScope: 'global' })
locale.value = useQuasar().lang.getLocale()

// 切換左右選單顯示
const leftDrawerState = ref(false)
const rightDrawerState = ref(false)
const toggleLeftDrawer = () => {
  leftDrawerState.value = !leftDrawerState.value
}
const toggleRightDrawer = () => {
  rightDrawerState.value = !rightDrawerState.value
}
//
const login = () => {

}

const loginForm = reactive({ password: '', account: '', keepLogin: false })
</script>

<style lang="sass" scoped>
.q-header
  height: 48px
.langSelect
  width: 100px
  & *
    color: white
</style>

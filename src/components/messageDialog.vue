<!-- 統一格式  -->
<template>
  <q-card id="msg">
    <!-- <q-card-section class="q-pb-none">
      title
    </q-card-section> -->
    <q-card-section v-if="articleMsg.datas.length > 0" class="q-pa-none" style="max-height:70vh;overflow-y:scroll;">
      <!-- <q-table :rows="p.form.datas" :columns="columns" row-key="id" virtual-scroll=true separator="none" hide-header
        flat hide-pagination>
        <template v-slot:body="props">
          <q-tr :props="props" auto-width no-hover>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">
              <button v-if="col.name === 'user'" class="cellBTN"
                @click="showUserInfo(col.value, props.row.user.record.toBoard.score, props.row.user.record.toBoard.amount, props.row.user.record.toBoard.scoreChart)">
                {{ col.value || t('anonymous') }}
              </button>
              <div v-else-if="col.name === 'content'"
                style="text-align: left; display:flex;justify-content: space-between; height:100%">
                <div v-html="col.value"></div>
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table> -->
      <q-list ref="msgBox">
        <q-item v-for="msg in articleMsg.datas" :key="msg.createdAt">
          <q-item-section avatar v-if="msg.state === 1">
            <q-avatar rounded>
              <q-icon v-if="msg.user.nickName === 'owner'" name="home" />
              <img v-else :src="'https://source.boringavatars.com/beam/120/' + (msg.user.nickName || 'you')">
            </q-avatar>
          </q-item-section>
          <q-item-section v-if="editingId !== msg.id && msg.state === 1" class="msgContent">
            <b> {{ msg.user.nickName === 'owner' ? t('owner') : (msg.user.nickName ===
                'you' || msg.user.nickName === undefined) ? t('you') : (msg.user.nickName || t('anonymous'))
            }}</b>
            {{ msg.content }}
          </q-item-section>
          <q-item-section v-if="msg.state === 0">
            <div class="q-ml-lg">{{ t('articleBanned') }}</div>
          </q-item-section>
          <div v-if="msg.state === 1">
            <div v-if="editingId !== msg.id">
              <q-btn v-if="msg.owner" square color="primary" flat icon="edit" style="height:100% "
                @click="editMsg(msg.id, msg.content, msg.privacy)">
              </q-btn>
              <q-btn v-if="msg.owner" square color="red" flat icon="delete" style="height:100% "
                @click="deleteMsg(msg.id)">
              </q-btn>
              <q-btn v-if="users.role === 0" square color="red" flat icon="cancel" style="height:100% "
                @click="banMsg(msg.id)">
              </q-btn>
            </div>
            <div v-else class="editArea">
              <q-input style="width:100%" filled v-model="editContent.content" dense @keydown.enter="updateMsg()">
                <template v-slot:after>
                  <q-btn @click="updateMsg" round dense flat icon="send" />
                </template>
              </q-input>
              <q-btn square color="red" flat icon="cancel" style="height:100% " @click="cancelEdit()">
              </q-btn>
            </div>
          </div>
        </q-item>
      </q-list>
    </q-card-section>
    <q-card-section v-else>{{ t('writeAComment') }}
    </q-card-section>
    <hr>
    <q-card-section class="q-pt-none">
      <q-select v-if="!articleMsg.isSelf" borderless v-model="msgForm.privacy" :options="privacyOptions" dense
        style="width:150px">
        <template v-slot:before>
          <p style="font-size: 0.8rem;color: black; margin: 0"> {{ t('privacy') }}:</p>
        </template>
      </q-select>
      <q-input filled v-model="msgForm.content" :placeholder="t('writeAComment')" dense
        @keydown.enter="users.token ? sendMsg() : loginState = true">
        <template v-slot:after>
          <q-btn v-if="users.token" @click="sendMsg" round dense flat icon="send" :loading="sendingMsg" />
          <q-btn v-else @click="loginState = true" round dense flat icon="send" />
        </template>
      </q-input>
    </q-card-section>
  </q-card>
  <!-- <q-dialog v-model="userInfoState">
    <chartInfo :form="userInfoForm" />
  </q-dialog> -->
</template>

<script setup >

import { ref, reactive, computed, inject } from 'vue'

// const userInfoState = ref(false)
// const userInfoForm = reactive({ title: '用戶', title: '', averageTitle: '給評平均', chartTitle: '評分總覽', score: 0, amount: 0, datas: [] })
// const showUserInfo = (title, score, amount, datas) => {
//   userInfoForm.title = title
//   userInfoForm.score = score
//   userInfoForm.amount = amount
//   userInfoForm.datas.length = 0
//   userInfoForm.datas.push(...datas)
//   userInfoState.value = true
// }
</script>
<style lang="sass" scoped>

</style>

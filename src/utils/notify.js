import { Notify } from 'quasar'
// import { useI18n } from 'vue-i18n'
// const { t } = useI18n()

export default (rep) => {
  Notify.create({
    message: rep.title,
    caption: rep.text,
    type: rep.success ? 'positive' : 'negative',
    position: rep.position ? rep.position : 'center',
    group: false,
    timeout: rep.duration ? rep.duration : 3000
  })
}

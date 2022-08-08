import { Notify } from 'quasar'

// or with a config object:

export default (rep) => {
  Notify.create({
    message: rep.title,
    caption: rep.text,
    type: rep.success ? 'positive' : 'negative',
    position: rep.position ? rep.position : 'center',
    group: false,
    timeout: rep.suration ? rep.suration * 1000 : 3000
  })
}

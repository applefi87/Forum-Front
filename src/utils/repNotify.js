import { Notify } from 'quasar'

// or with a config object:

export default (data, result) => {
  const rep = result ? { success: data.success, ...data.message, result } : { success: data.success, ...data.message }
  Notify.create({
    message: rep.title,
    caption: rep.text,
    type: rep.success ? 'positive' : 'negative',
    position: rep.position ? rep.position : 'center',
    group: false,
    timeout: rep.suration ? rep.suration * 1000 : 3000
  })
}

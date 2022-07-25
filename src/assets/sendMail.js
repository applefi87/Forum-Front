// import 'dotenv/config'
import nodemailer from 'nodemailer'

export default (pwd) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      user: 'applefi87@gmail.com',
      pass: pwd
    }
  })

  transporter.sendMail({
    from: 'applefi87@gmail.com',
    to: 'werrtyyui@yahoo.com.tw',
    subject: '測試喔',
    html: 'wwww'
  }).then(info => {
    console.log({ info })
  }).catch(console.error)
}

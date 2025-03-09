import axios from 'axios'
import { EMAILIT_API_KEY, EMAILIT_API_URL, FROM_EMAIL, FROM_NAME } from '~/libs'

export const sendEmail = async ({ to, subject, text }) => {
  const apiKey = EMAILIT_API_KEY
  const apiUrl = EMAILIT_API_URL
  const from = `${FROM_NAME} <${FROM_EMAIL}>`

  if (!apiKey || !apiUrl || !from) {
    console.error('Mailit API key or URL not found')
    return
  }

  const emailData = {
    from,
    to: to,
    subject: subject,
    text: text,
  }

  try {
    const response = await axios.post(apiUrl, emailData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
    })
    console.log('Email sent successfully:', response.data)
  } catch (error) {
    console.error('Error sending email:', error)
  }
}

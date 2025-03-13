import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_SECRET_ACCESS_KEY } from '@/constants/environments'
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'

import { logger } from './logger'

// Initialize SES client
const sesClient = new SESv2Client({
  region: AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID || '',
    secretAccessKey: AWS_SECRET_ACCESS_KEY || ''
  }
})

export const sendEmail = async (to: string, subject: string, body: string): Promise<void> => {
  try {
    const params = {
      Destination: {
        ToAddresses: [to]
      },
      Content: {
        Simple: {
          Body: {
            Text: {
              Data: body
            }
          },
          Subject: {
            Data: subject
          }
        }
      },
      FromEmailAddress: 'no-reply@arciniega.io'
    }

    await sesClient.send(new SendEmailCommand(params))
  } catch (error) {
    logger.error({ error }, 'Error sending email')
    throw new Error('Failed to send email')
  }
}

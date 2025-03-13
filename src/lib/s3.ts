import { AWS_ACCESS_KEY_ID, AWS_REGION, AWS_S3_BUCKET_NAME, AWS_SECRET_ACCESS_KEY } from '@/constants/environments'
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

import { logger } from './logger'

// Initialize S3 client
const s3Client = new S3Client({
  region: AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID || '',
    secretAccessKey: AWS_SECRET_ACCESS_KEY || ''
  }
})

export const uploadFileToS3 = async (file: Buffer, fileName: string, contentType: string): Promise<string> => {
  try {
    const params = {
      Bucket: AWS_S3_BUCKET_NAME || '',
      Key: `loan-documents/${fileName}`,
      Body: file,
      ContentType: contentType
    }

    await s3Client.send(new PutObjectCommand(params))
    const fileUrl = `https://${AWS_S3_BUCKET_NAME}.s3.amazonaws.com/loan-documents/${fileName}`

    return fileUrl
  } catch (error) {
    logger.error({ error }, 'Error uploading file to S3')
    throw new Error('Failed to upload file')
  }
}

export const deleteFileFromS3 = async (fileUrl: string): Promise<void> => {
  try {
    // Extract key from URL
    const key = fileUrl.split('.s3.amazonaws.com/')[1]

    const params = {
      Bucket: AWS_S3_BUCKET_NAME || '',
      Key: key
    }

    await s3Client.send(new DeleteObjectCommand(params))
  } catch (error) {
    logger.error({ error }, 'Error deleting file from S3')
    throw new Error('Failed to delete file')
  }
}

export default s3Client

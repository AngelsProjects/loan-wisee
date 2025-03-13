import { NODE_ENV } from '@/constants/environments'
import pino from 'pino'

// Simple logger that works in both browser and server contexts
const logger = pino({
  level: NODE_ENV === 'production' ? 'info' : 'debug',
  browser: {
    asObject: true
  }
})

export { logger }

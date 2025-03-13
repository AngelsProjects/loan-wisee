import { NODE_ENV, REDIS_URL } from '@/constants/environments'
import Redis from 'ioredis'

import { logger } from './logger'

const globalForRedis = globalThis as unknown as { redis: Redis }

const getRedisUrl = () => {
  if (REDIS_URL) {
    return REDIS_URL
  }

  throw new Error('REDIS_URL is not defined')
}

export const redis = globalForRedis.redis || new Redis(getRedisUrl())

if (NODE_ENV !== 'production') {
  globalForRedis.redis = redis
}

redis.on('error', error => {
  logger.error({ error }, 'Redis connection error')
})

export default redis

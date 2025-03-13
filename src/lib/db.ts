import { NODE_ENV } from '@/constants/environments'
import { PrismaClient } from '@prisma/client'

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  }).$extends({
    query: {
      $allModels: {
        async findMany({ args, query }) {
          args.where = { ...args.where, deletedAt: null }
          return query(args)
        }
      }
    }
  })

if (NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma

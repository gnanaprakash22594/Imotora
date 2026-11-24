import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const databaseUrl = process.env.DATABASE_URL || ''
const isLocalDb =
  databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1')

module.exports = defineConfig({
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === 'true',
    backendUrl: process.env.MEDUSA_BACKEND_URL,
  },
  projectConfig: {
    databaseUrl,
    ...(isLocalDb
      ? {}
      : {
          databaseDriverOptions: {
            connection: {
              ssl: { rejectUnauthorized: false },
            },
          },
        }),
    ...(process.env.REDIS_URL && !process.env.REDIS_URL.includes('localhost')
      ? { redisUrl: process.env.REDIS_URL }
      : {}),
    http: {
      storeCors: process.env.STORE_CORS || 'http://localhost:3000',
      adminCors: process.env.ADMIN_CORS || 'http://localhost:9000',
      authCors: process.env.AUTH_CORS || 'http://localhost:3000,http://localhost:9000',
      jwtSecret: process.env.JWT_SECRET || 'supersecret',
      cookieSecret: process.env.COOKIE_SECRET || 'supersecret',
    },
  },
})


import { defineConfig, env } from 'prisma/config'
import dotenv from 'dotenv'
import path from 'path'

// Load .env file explicitly
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.POSTGRES_DB_URL as string
  },
})
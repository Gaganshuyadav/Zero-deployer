
import { defineConfig, env } from 'prisma/config'

console.log("ENV =", process.env.POSTGRES_DB_URL);
console.log("ENV =--", env('POSTGRES_DB_URL'));

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('POSTGRES_DB_URL')
  },
})
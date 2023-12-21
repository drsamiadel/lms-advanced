import zod from 'zod';

const envSchema = zod.object({
  PORT: zod.string().default('3000'),
  NODE_ENV: zod.enum(['development', 'production']).default('development'),
  DATABASE_URL: zod.string().min(1),
  GOOGLE_CLIENT_ID: zod.string().min(1),
  GOOGLE_CLIENT_SECRET: zod.string().min(1),
  NEXTAUTH_URL: zod.string().min(1),
  NEXTAUTH_SECRET: zod.string().min(1),
});

export type Env = zod.infer<typeof envSchema>;
export const env: Env = envSchema.parse(process.env);
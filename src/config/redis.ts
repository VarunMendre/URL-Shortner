import Redis from "ioredis";
import { env } from "./env.js";

type RedisClient = {
  get: (...args: unknown[]) => Promise<string | null>;
  set: (...args: unknown[]) => Promise<unknown>;
  quit: () => Promise<unknown>;
  disconnect: () => void;
};

const RedisClientCtor = Redis as unknown as new (
  url: string,
  options?: {
    maxRetriesPerRequest?: null;
    enableReadyCheck?: boolean;
    lazyConnect?: boolean;
  },
) => RedisClient;

const globalForRedis = globalThis as unknown as {
  redis?: RedisClient;
};

export const redis =
  globalForRedis.redis ??
  new RedisClientCtor(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    lazyConnect: true,
  });

if (env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}

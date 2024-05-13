import redis from "redis";
import connectRedis from "connect-redis";
import dotenv from "dotenv";
import { rateLimit as expressRateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";

dotenv.config();

const redisClient = redis.createClient({ url: process.env.REDIS_SERVER_URL });

redisClient.connect().catch(console.error);

let redisStore = new connectRedis({
    client: redisClient,
    prefix: "core_server_redis:",
});

const session = {
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    store: redisStore,
};

const rateLimit = expressRateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
        sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    }),
});

const redisConfig = { session, rateLimit };

export { redisConfig };

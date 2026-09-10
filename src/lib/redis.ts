import { createClient } from 'redis';

export const redisClient = createClient({
    username: 'default',
    password: 'snC4ip5TaGuoYL7Chs0S7JBc6Xx5A0Wb',
    socket: {
        host: 'scarecrow-man-tray-38212.db.redis.io',
        port: 16972
    }
});
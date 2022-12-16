const redis = require('redis');
const { REDIS_HOST, REDIS_PORT } = require('./config');
const { fibonacciSequence } = require('./fibonacci');

const redisClient = redis.createClient({
    url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});

const subscriber = redisClient.duplicate();

subscriber.on('error', (error) => {
    console.error(error);
});

(async () => {
    try {
        await redisClient.connect();
        await subscriber.connect();

        await subscriber.subscribe('insert', async (message) => {
           const result = fibonacciSequence(parseInt(message));

           await redisClient.hSet('values', message, `${result}`);
        });
    } catch (error) {
        console.error(error);
        process.exit(0);
    }
})();
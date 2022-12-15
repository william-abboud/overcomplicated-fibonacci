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
        await subscriber.connect();

        await subscriber.subscribe('insert', (message) => {
           const result = fibonacciSequence(parseInt(message));

           redisClient.hSet('values', message, result);
        });
    } catch (error) {
        console.error(error);
        process.exit(0);
    }
})();
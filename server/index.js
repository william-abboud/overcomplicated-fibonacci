const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const redis = require('redis');

const { dbUser, dbHost, dbPassword, dbPort, dbName, redisHost, redisPort } = require('./config');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const redisClient = redis.createClient({
    url: `redis://${redisHost}:${redisPort}`,
});

const redisPublisher = redisClient.duplicate();

const pool = new Pool({
    user: dbUser,
    password: dbPassword,
    host: dbHost,
    port: dbPort,
    database: dbName,
});

pool.connect();

pool.on('error', () => {
    console.log('Lost PG connection');
});

(async () => {
    try {
        await pool.query('CREATE TABLE IF NOT EXISTS values (number INT)');

        console.log("Table 'values' created");
    } catch (error) {
        console.error(error);
    }
})();

app.get('/values', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM values');

    res.send(rows);
}); 

app.get('/values/current', (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    });
});

app.post('/calculate-fibonacci', async (req, res) => {
    const num = parseInt(req.body.num, 10);

    if (isNaN(num)) {
        return res.status(400).send('Invalid number');
    }

    if (num > 40) {
        return res.status(400).send('Number too high');
    }
    
    redisClient.hset('values', num, 'Calculating...');
    
    await redisPublisher.publish('insert', num);
    
    pool.query("INSERT INTO values VALUES ($1)", [num]);

    res.send({ working: true });
});

app.listen(5000, () => {
    console.log('Listening on port 5000');
});
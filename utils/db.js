const MongoClient = require('mongodb').MongoClient;
const MONGO_URL = 'mongodb://127.0.0.1:27017';

let client;

async function getDb() {
    if (!client) {
        client = await MongoClient.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
    const db = client.db('artDb');
    return db;
}

module.exports = getDb;
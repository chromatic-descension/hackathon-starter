const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const getDb = require('../utils/db');
const COMMAND_RUNNER = require('./command_runner');

const fixPath = require('../utils/fixPath');

const OUTPUT_PATH = '/home/lucas/art/crazy/output';
const SCALE = 400;

class Backend {
    constructor() {
        this.lastRandomContent = null;
        this.lastRandomStyle = null;
        this.lastRandomOutput = null;
    }

    async transformRandomImages() {
        const outputName = `${uuidv4()}.jpg`;
        const outputPath = `${OUTPUT_PATH}/${outputName}`;
        this.lastRandomOutput = outputName;

        const scale = SCALE;
        const style = await this.getRandomStyle();
        this.lastRandomStyle = fixPath.getStylePath(style.path);
        
        const content = await this.getRandomContent();
        this.lastRandomContent = fixPath.getContentPath(content.path);

        const success = await COMMAND_RUNNER.transformImage(content.path, style.path, outputPath, scale);
        if (!success) return false;

        return this.storeOutput(content.path, style.path, outputPath, outputName, scale);
    }

    async storeOutput(contentPath, stylePath, outputPath, outputName, scale) {
        const db = await getDb();
        const obj = { fileName: outputName, path: outputPath, contentPath, stylePath, scale };
        return new Promise((resolve, reject) => {
            db.collection('outputImages').insertOne(obj, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    console.log(`Inserted into collection outputImages.`);
                    resolve(true);
                }
            });
        });
    }

    async getRandomOutput() {
        const db = await getDb();
        return await db.collection('outputImages').aggregate([{ '$sample': { size: 1 } }]).next();
    }

    async getRandomStyle() {
        const db = await getDb();
        return await db.collection('styleImages').aggregate([{ '$sample': { size: 1 } }]).next();
    }

    async getRandomContent() {
        const db = await getDb();
        return await db.collection('contentImages').aggregate([{ '$sample': { size: 1 } }]).next();
    }
}




module.exports = new Backend();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const getDb = require('../utils/db');
const COMMAND_RUNNER = require('./command_runner');

const fixPath = require('../utils/fixPath');

const OUTPUT_PATH = '/home/lucas/art/crazy/output';
const SCALE = 1536;
const LISTEN_LOOP_TIME = 1000;

class Backend {
    constructor() {
        this.lastRandomContent = null;
        this.lastRandomStyle = null;
        this.lastRandomOutput = null;
        this.autoConverting = false;
        setInterval(() => { this.autoConvertLoop() }, LISTEN_LOOP_TIME);
    }

    autoConvertLoop() {
        if (this.autoConverting && !COMMAND_RUNNER.running) {
            this.transformRandomImages();
        }
    }

    async transformRandomImages() {
        const outputName = `${uuidv4()}.jpg`;
        const outputPath = `${OUTPUT_PATH}/${outputName}`;
        this.lastRandomOutput = outputName;

        const scale = SCALE;
        const style = await this.getRandomStyle();
        this.lastRandomStyle = fixPath.getStylePath(style);

        const content = await this.getRandomContent();
        this.lastRandomContent = fixPath.getContentPath(content);

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

    async getMostRecentOutputs() {
        const db = await getDb();
        const cursor = db.collection('outputImages').find().sort({ _id: -1 }).limit(500);
        let outputs = new Array();
        for await (const data of cursor) {
            console.log(data);
            outputs.push(data);
        }
        return outputs;
    }

    async getOutputImage(fileName) {
        const db = await getDb();
        return await db.collection('outputImages').find({ fileName }).next();
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
        // return await db.collection('contentImages').find({'fileName':'bella_edit.jpg'}).next();
    }

    setAutoConverting(value) {
        if (value === true) {
            this.autoConverting = true;
        } else {
            this.autoConverting = false;
        }
    }

    async convertBatch() {
        const db = await getDb();
        const batch = [
            '1520f7b2-6d97-4452-a615-ea839d61db56.jpg',
        ];
        console.log(await db.collection('styleImages').aggregate([{ '$sample': { size: 1 } }]).next());
        for (const batchImageName of batch) {
            const output = await db.collection('outputImages').find({'fileName':batchImageName}).next();

            const outputName = `${uuidv4()}.jpg`;
            const outputPath = `${OUTPUT_PATH}/${outputName}`;
            this.lastRandomOutput = outputName;
    
            const scale = SCALE;
            console.log(output.stylePath);
            const style = await db.collection('styleImages').find({'path':output.stylePath}).next();
            this.lastRandomStyle = fixPath.getStylePath(style);
    
            const content = await db.collection('contentImages').find({'path':output.contentPath}).next();
            this.lastRandomContent = fixPath.getContentPath(content);
            
            console.log(content.path + ' and ' + style.path + ' and ' + outputPath + ' and ' + scale);
            const success = await COMMAND_RUNNER.transformImage(content.path, style.path, outputPath, scale);
            if (!success) continue;
    
            this.storeOutput(content.path, style.path, outputPath, outputName, scale);
        }
    }
}



module.exports = new Backend();

const cmd = require('node-cmd');

/** Singleton class for running bash commands. */
class CommandRunner {

    constructor() {
        this.running = false;
    }

    /** Transform content image using style image and store at output path.
     * 
     * Will not run if another command is in progress.
     * 
     * @returns boolean indicating whether or not the command was run.
     */
    transformImage(contentPath, stylePath, outputPath, scale) {
        if (this.running) return Promise.resolve(false);

        this.running = true;

        const command = `/home/lucas/art/insane/backend/convert_image.sh ${contentPath} ${stylePath} ${outputPath} ${scale}`;
        console.log('Starting conversion with command:');
        console.log(command);
        return new Promise((resolve, reject) => {
            cmd.run(command, (err, data, stderr) => {
                this.running = false;
                console.log('Finished.');
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

}

module.exports = new CommandRunner();
const { spawn } = require('child_process');
const path = require('path');

module.exports = function predictAnomaly(features) {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, '../ml/predict.py');

        const process = spawn('python', [
            scriptPath,
            JSON.stringify(features)
        ]);

        process.stdout.on('data', data => {
            resolve(data.toString().trim());
        });

        process.stderr.on('data', err => {
            reject(err.toString());
        });
    });
};

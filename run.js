const { spawn } = require('child_process');

const raw = { stdio: 'inherit' };
function log(data) {
    const msg = data.toString().trim();
    const m = msg.toLowerCase();
    // 如果data包含字符串'Message'，则打印到控制台
    if (m.includes('err')) {
        console.error(msg);
    } else if (m.includes('warn') || m.includes('critical')) {
        console.warn(msg);
    } else if (m.includes('message')) {
        console.debug(msg);
    } else if (m.includes('info')) {
        console.info(msg);
    } else {
        console.log(msg);
    }
}
const execCommand = async (command) => {
    return new Promise((resolve, reject) => {
        const [cmd, ...args] = command.split(' ');
        const childProcess = spawn(cmd, args);
        childProcess.stdout.on('data', (data) => {
            log(data);
        });
        childProcess.stderr.on('data', (data) => {
            log(data);
        });
        childProcess.on('error', (error) => {
            reject(error);
        });
        childProcess.on('exit', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Command exited with code ${code}.`));
            }
        });
    });
};

execCommand('./run.sh');
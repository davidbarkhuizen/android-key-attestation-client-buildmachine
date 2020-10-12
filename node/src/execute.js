// import util from 'util';
import child_process from 'child_process' 
// const exec = util.promisify(child_process.exec);

// export const execute = async (command, cwd) => {

//     try {
//         const { stdout, stderr } = await exec(command, { cwd });
//         return { outcome: true, stdout, stderr };
//     } catch (e) {
//         console.log(`error on exec`);
//         console.log(`cmd: ${command}`);
//         console.log(`cwd: ${cwd}`);
//         console.error(e, e.stack);
//         return {  };
//     }
// };

export const execute = (command, cwd, logFn) => new Promise(function(resolve, reject) { 
    
    // `STDOUT:\n${stdout || 'none'}\nSTDERR:\n${stderr || 'none'}`;

    try {

        const terminate = (error, stdout, stderr) => {
            if (error) {
                resolve({ outcome: false, stdout:error.stdout, stderr: error.stderr, error });
            } else {
                // TODO need to check proc exit code == 0
                resolve({ outcome: true, stdout, stderr });
            }
        };

        const childProcess = child_process.exec(command, { cwd }, terminate);

        childProcess.stdout.on('data', (data) => logFn(data));
        childProcess.stderr.on('data', (data) => logFn(data));
    } catch (e) {
        reject(e);
    }
});
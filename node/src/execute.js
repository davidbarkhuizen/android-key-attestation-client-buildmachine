import util from 'util';
import child_process from 'child_process' 
const exec = util.promisify(child_process.exec);

export const execute = async (command, cwd) => {

    try {
        const { stdout, stderr } = await exec(command, { cwd });
        return { outcome: true, stdout, stderr };
    } catch (e) {
        console.log(`error: ${e}`);;
        return { outcome: false, stdout:e.stdout, stderr: e.stderr, error: e };
    }
};
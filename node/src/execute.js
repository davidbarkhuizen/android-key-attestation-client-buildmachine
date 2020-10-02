const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function execute(command) {

    try {
        const { stdout, stderr } = await exec(command);
    } catch (e) {

        text = e.stdout;
        errorText = e.stderr;
    }
  
  
  
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}
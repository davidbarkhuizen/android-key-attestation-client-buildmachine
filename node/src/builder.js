import * as path from 'path';

import { execute } from './execute.js'

export const build = async (
    checkoutLocation,
    buildCommand,
    buildCommandPath
) => {
    console.log(`executing build command: ${buildCommand}`);

    const cwd = path.join(checkoutLocation, buildCommandPath);

    const { stdout, stderr, outcome } = await execute(buildCommand, cwd);
    console.log('executed.');
    console.log('stdout');
    console.log(stdout);
    console.log('stderr');
    console.log(stderr);

    return { commitHash: 'fish', stdout_stderr: stdout + '\n' + stderr };
};
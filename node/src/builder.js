import * as path from 'path';

import { execute } from './execute.js'

export const build = async (
    checkoutLocation,
    buildCommand,
    buildCommandPath
) => {
    console.log(`executing build command: ${buildCommand}`);

    try {
        const cwd = path.join(checkoutLocation, buildCommandPath);
        const { stdout, stderr, outcome } = await execute(buildCommand, cwd, console.log);
        return outcome;
    } catch (e) {
        // e.toString();
        return false;
    };
};
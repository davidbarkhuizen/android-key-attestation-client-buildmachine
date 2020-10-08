import * as fs from 'fs';
import util from 'util';
const readdir = util.promisify(fs.readdir);

import * as path from 'path';

import { default as scp2 } from 'scp2';
const connect = util.promisify(scp2.scp);

export const publish = async (
    host, 
    user,
    keyFilePath,
    checkoutPath, 
    buildArtefactsFolderPath, 
    publishPath
) => {
  
    console.log('publishing...');

    const artefacts = [];

    try {

        const localFolderPath = path.join(checkoutPath, buildArtefactsFolderPath);

        const sourceFiles = await readdir(localFolderPath)

        for (let sourceFile of sourceFiles) {

            const sourceFilePath = path.join(localFolderPath, sourceFile);

            const destFilePath = path.join(publishPath, sourceFile);

            console.log(`from local path ${sourceFilePath}`);
            console.log(`to remote path ${host}:${destFilePath}`);
    
            await connect(sourceFilePath, {
                host: host,
                username: user,
                privateKey: fs.readFileSync(keyFilePath),
                passphrase: '',
                path: publishPath
            });

            artefacts.push(sourceFile);

            console.log(sourceFile);
        }

        return artefacts;
    }
    catch (e) { 

        console.log('ssh error', e);
        return artefacts;
    }
};
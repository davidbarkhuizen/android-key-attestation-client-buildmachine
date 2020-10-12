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
  
    const artefacts = [];

    try {

        const localFolderPath = path.join(checkoutPath, buildArtefactsFolderPath);

        console.log(`looking for build artefacts @ ${localFolderPath}`);

        const sourceFiles = await readdir(localFolderPath)

        for (let sourceFile of sourceFiles) {

            const sourceFilePath = path.join(localFolderPath, sourceFile);

            const destFilePath = path.join(publishPath, sourceFile);

            console.log(`from localhost:${sourceFilePath}`);
            console.log(`to ${host}:${destFilePath}`);
    
            await connect(sourceFilePath, {
                host: host,
                username: user,
                privateKey: fs.readFileSync(keyFilePath),
                passphrase: '',
                path: publishPath
            });

            artefacts.push(sourceFile);

            console.log(`copied build artefact ${sourceFile}`);
        }
    }
    catch (e) { 
        console.log('ssh error', e);
    } finally {
        return `published ${artefacts.length} artefacts to ${host}:${publishPath}\n${artefacts.join('\n')}`;
    }
};
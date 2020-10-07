import * as fs from 'fs';
import util from 'util';
const readdir = util.promisify(fs.readdir);

import * as path from 'path';
import { NodeSSH } from 'node-ssh';

import { default as scp2 } from 'scp2';
const connect = util.promisify(scp2.scp);





// const ssh = new NodeSSH();

// TODO username, keyfile

export const publish = async (
    publishHost, 
    checkoutPath, 
    buildArtefactsFolderPath, 
    publishPath
) => {
  
    console.log('publishing...');

    try {

        // await ssh.connect({
        //     host: publishHost,
        //     username: 'buildmachine',
        //     privateKey: '/root/.ssh/id_rsa'
        // });

        const localFolderPath = path.join(checkoutPath, buildArtefactsFolderPath);
        for (const sourceFile of await readdir(localFolderPath)) {

            const sourceFilePath = path.join(localFolderPath, sourceFile);

            const destFilePath = path.join(publishPath, sourceFile);

            console.log(`from local path ${sourceFilePath}`);
            console.log(`to remote path ${publishHost}:${destFilePath}`);
    
            // await ssh.putFile(
            //     sourceFilePath, 
            //     publishPath
            // );

            await connect(sourceFilePath, {
                host: publishHost,
                username: 'buildmachine',
                privateKey: fs.readFileSync('/root/.ssh/id_rsa'),
                passphrase: '',
                path: publishPath
            });

            console.log(sourceFile);
        }
    }
    catch (e) { 

        console.log('ssh error', e);
    }
};
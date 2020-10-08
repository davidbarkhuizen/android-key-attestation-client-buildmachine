import util from 'util';

import rimraf from 'rimraf';
const rimrafAsync = util.promisify(rimraf);

export const cleanLocation = async (
    filePath,
    label
) => {
  
    console.log(`cleaning ${label} @ ${filePath}...`);
    await rimrafAsync(filePath);
    
    console.log('cleaned');
};
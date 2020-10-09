import nodegit from "nodegit";

const credentialsCallback = (url, userName) => nodegit.Cred.sshKeyFromAgent(userName)

var cloneOptions = {
    fetchOpts: {
        callbacks: {
            credentials: credentialsCallback
        }
    }
};

export const clone = async (url, checkoutLocation) => {
    try {        
        console.log(`cloning repo ${url} to location ${checkoutLocation} ...`);
        await nodegit.Clone(url, checkoutLocation, cloneOptions);
        console.log('cloned.');
        return true;
    } catch (e) {

        // error [Error: failed to resolve address for github.com: Temporary failure in name resolution] {
        //     server_1  |   errno: -1,
        //     server_1  |   errorFunction: 'Clone.clone'
        //     server_1  | }
            

        console.log('error', e);
        return false;
    }
};

const getRepo = async (checkoutLocation) => nodegit.Repository.open(checkoutLocation);

export const fetch = async (checkoutLocation) => {

    console.log('fetching code...');
    const repo = await getRepo(checkoutLocation);
    await repo.fetch('origin', { callbacks: { credentials: credentialsCallback }});
    
    return repo;
};

export const getLatestTag = async (repo) => {

    const tagNames = await nodegit.Tag.list(repo);

    if (tagNames.length == 0) {
        return null;
    }

    const tags = [];

    for (const tagName of tagNames) {

        const ref = await nodegit.Reference.lookup(repo, `refs/tags/${tagName}`);
        const commit = await nodegit.Commit.lookup(repo, ref.target());

        tags.push({ 
            tagName, 
            date: commit.date()
        });
    }

    tags.sort(function(a, b){ 

        if (a.date > b.date) {
            return 1;
        } else if (a.date < b.date) {
            return -1;
        } else {
            return 0;
        } 
    });

    return tags[0].tagName;
};

// const commit = repo.getReferenceCommit('head');


// git.Checkout.tree(repo, tag.targetId()

// origin/dev

// GitTag.list(repo);

// latest commit for branch
//
// repository.getBranchCommit(name).then(function(commit) {
// // Use commit
// });

// // commit for hash
// repository.getCommit(String).then(function(commit) {
// // Use commit
// });

// // tag for oid
// repository.getTag(String).then(function(tag) {
// // Use tag
// });

// repository.getTagByName(Short).then(function(tag) {
// // Use tag
// });
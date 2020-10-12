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
        console.log('error', e);
        return false;
    }
};

const getRepo = async (checkoutLocation) => 
    nodegit.Repository.open(checkoutLocation);

const getUrlForRepoRemote = async (repo, remoteName) => {
    const remote = await repo.getRemote(remoteName);
    const url = await remote.url();
    return url;
}

export const fetch = async (checkoutLocation, verbose) => {

    const repo = await getRepo(checkoutLocation);

    const url = await getUrlForRepoRemote(repo, 'origin');

    if (verbose) { console.log(`fetching code from ${url}...`); }
    await repo.fetch('origin', { callbacks: { credentials: credentialsCallback }});
    if (verbose) { console.log('fetched.'); }

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
            name: tagName, 
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

    tags.reverse();    

    return (tags.length > 0) ? tags[0] : null;
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
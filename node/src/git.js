import nodegit from "nodegit";

const credentialsCallback = (url, userName) => nodegit.Cred.sshKeyFromAgent(userName)

var cloneOptions = {
    fetchOpts: {
        callbacks: {
            credentials: credentialsCallback
        }
    }
};

// 1. initial clone

// const commit = repo.getReferenceCommit('head');

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
    return await repo.fetch('origin', { callbacks: { credentials: credentialsCallback }});
};

const checkForNewTag = async (repo) => {

    const tags = await nodegit.Tag.list(repo);
    console.log(tags);

    tags.map(
        async () => {
            const ref = await nodegit.Reference.lookup(repo, `refs/tags/${tagName}`);
            const commit = await nodegit.Commit.lookup(repo, ref.target());
            console.log(commit.date().toJSON())
        }
    );
};

// git.Checkout.tree(repo, tag.targetId()
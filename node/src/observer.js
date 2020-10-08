var schedule = require("node-schedule");

let job = null;

export const start = (intervalSeconds, onTick) => {

    var rule = new schedule.RecurrenceRule();
    rule.second = intervalSeconds;
    
    job = schedule.scheduleJob(rule, onTick);
};

export const stop = () => {
    if (job) {
        job.cancel();
        job = null;
    }
};


// origin/dev

// GitTag.list(repo);


// latest commit for branch
//
repository.getBranchCommit(name).then(function(commit) {
    // Use commit
  });

  // commit for hash
  repository.getCommit(String).then(function(commit) {
    // Use commit
  });

  // tag for oid
  repository.getTag(String).then(function(tag) {
    // Use tag
  });

  repository.getTagByName(Short).then(function(tag) {
    // Use tag
  });

// trigger
// - commit => get latest commit, compare to last built, rebuild if different
// - tag => get all tags, sort by date, compare latest to last built
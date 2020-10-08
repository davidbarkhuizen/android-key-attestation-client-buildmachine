var schedule = require("node-schedule");

let job = null;

export const startTicker = (intervalSeconds, onTick) => {

    var rule = new schedule.RecurrenceRule();
    rule.second = intervalSeconds;
    
    job = schedule.scheduleJob(rule, onTick);
};

export const stopTicker = () => {
    if (job) {
        job.cancel();
        job = null;
    }
};
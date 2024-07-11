const {Job} = require("../models");

const jobData = [
    {
        title: "Software engineer 1",
        job_description: "This is job description",
        recruiter_id: 1,
    },
    {
        title: "Software engineer 2",
        job_description: "This is job description",
        recruiter_id: 1,
    },
];

const seedJobs = () => Job.bulkCreate(jobData, {});

module.exports = seedJobs;
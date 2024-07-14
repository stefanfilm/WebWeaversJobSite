const {Job} = require("../models");

const jobData = [
    {
        title: "Software engineer 1",
        job_description: "This is job description",
        salary: 120_000,
        recruiter_id: 1,
        user_id: 1
    },
    {
        title: "Software engineer 2",
        job_description: "This is job description",
        salary: 150_000,
        recruiter_id: 1,
        user_id: 1
    },
    {
        title: "Software engineer 3",
        job_description: "This is job description",
        salary: 150_000,
        recruiter_id: 1,
        user_id: 1
    },
    {
        title: "Software engineer 4",
        job_description: "This is job description",
        salary: 150_000,
        recruiter_id: 1,
    },
    {
        title: "Software engineer 5",
        job_description: "This is job description",
        salary: 150_000,
        recruiter_id: 1,
    },
];

const seedJobs = () => Job.bulkCreate(jobData, {});

module.exports = seedJobs;
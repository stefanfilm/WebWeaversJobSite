const { Application } = require("../models");

const applicationData = [
    {
        user_id: 1,
        job_id: 1
    },
    {
        user_id: 1,
        job_id: 2
    },
    {
        user_id: 1,
        job_id: 3
    }
];

const seedApplications = () => Application.bulkCreate(applicationData);

module.exports = seedApplications;
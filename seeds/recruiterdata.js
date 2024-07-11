const {Recruiter} = require("../models");

const recruiterData = [
    {
        company_name: "ABC",
        location: "123 abc, def, 12345"
    },
    {
        company_name: "XYZ",
        location: "123 abc, def, 12345"
    },
];

const seedRecruiters = () => Recruiter.bulkCreate(recruiterData);

module.exports = seedRecruiters;
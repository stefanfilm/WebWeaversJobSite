const { Recruiter } = require("../models");

const recruiterData = [
    {
        company_name: "ABC",
        location: "123 abc, def, 12345",
        username: "thinh1",
        email: "thinh1@gmail.com",
        password: "1"
    },
    {
        company_name: "XYZ",
        location: "123 abc, def, 12345",
        username: "thinh2",
        email: "thinh2@gmail.com",
        password: "1"
    },
];

const seedRecruiters = () => Recruiter.bulkCreate(recruiterData, { individualHooks: true });

module.exports = seedRecruiters;
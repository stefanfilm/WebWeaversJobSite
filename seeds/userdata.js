const { User } = require("../models");

const userData = [
    {
        first_name: "Thinh",
        last_name: "Nguyen",
        username: "thinh123",
        password: "asdasdasd",
        email: "thinh@mail.com",
        job_title: "software engineer",
    },
    {
        first_name: "Stefan",
        last_name: "Wanigatunga",
        username: "stefan123",
        password: "asdasdasd",
        email: "stefan@mail.com",
        job_title: "software engineer",
    }
];

const seedUsers = () => User.bulkCreate(userData, {
    individualHooks: true
});

module.exports = seedUsers;
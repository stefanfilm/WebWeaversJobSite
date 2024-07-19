const sequelize = require("../config/connection");
const seedUsers = require("./userdata");
const seedRecruiters = require("./recruiterdata");
const seedJobs = require("./jobdata");
const seedApplications = require("./applicationdata");

const seedAll = async () => {
    try {
        // console.log("Starting database synchronization...");
        await sequelize.sync({ force: true });
        // console.log("Database synced\n\n");

        await seedUsers();
        // console.log("User synced\n\n");

        await seedRecruiters();
        // console.log("Poster synced\n\n");

        await seedJobs();
        // console.log("Comment synced\n\n");

        await seedApplications();

        process.exit(0);
    }catch(error){
        console.error("Fail to seed data: \n\n", error);
        process.exit(1);
    }
}

seedAll();
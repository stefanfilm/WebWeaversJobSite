const Job = require("./Job");
const Recruiter = require("./Recruiter");
const User = require("./User");
const Application = require("./Application");

Recruiter.hasMany(Job, {
    foreignKey: "recruiter_id",
    onDelete: "CASCADE"
});

Job.belongsTo(Recruiter, {
    foreignKey: "recruiter_id"
});

Job.hasMany(Application, {
    foreignKey: "job_id",
    onDelete: "CASCADE"
});

User.hasMany(Application, {
    foreignKey: "user_id",
    onDelete: "CASCADE"
});

Application.belongsTo(User, {
    foreignKey: "user_id"
});

Application.belongsTo(Job, {
    foreignKey: "job_id"
});

module.exports = {Job, Recruiter, User, Application};
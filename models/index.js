const Job = require("./Job");
const Recruiter = require("./Recruiter");
const User = require("./User");

Recruiter.hasMany(Job, {
    foreignKey: "recruiter_id",
    onDelete: "CASCADE"
});

Job.belongsTo(Recruiter, {
    foreignKey: "recruiter_id"
});

Job.hasMany(User, {
    foreignKey: "user_id",
    onDelete: "CASCADE"
})
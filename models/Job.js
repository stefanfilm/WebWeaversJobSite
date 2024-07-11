// when job is remove, all users who registered will be removed.
const sequelize = require("../config");
const { Model, DataTypes } = require("sequelize");

class Job extends Model {}

Job.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    job_description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    recruiter_id: {
        type: DataTypes.INTEGER,
        references: "recruiter",
        key: "id"
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: "user",
        key: "id"
    }
},
{
    sequelize,
    freezeTableName: true,
    timestamps: true,
    modelName: "job"
});

module.exports = Job;
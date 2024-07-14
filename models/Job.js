// when job is remove, all users who registered will be removed.
const sequelize = require("../config/connection");
const { Model, DataTypes } = require("sequelize");

class Job extends Model { }

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
    salary: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
            min: 0.01
        }
    },
    recruiter_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "recruiter",
            key: "id"
        }
    },
},
    {
        sequelize,
        freezeTableName: true,
        timestamps: true,
        underscored: true,
        modelName: "job"
    });

module.exports = Job;
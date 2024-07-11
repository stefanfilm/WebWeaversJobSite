const sequelize = require("../config/connection");
const { Model, DataTypes } = require("sequelize");

class Recruiter extends Model { }

Recruiter.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    company_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
{
    sequelize,
    freezeTableName: true,
    timestamps: false,
    modelName: "recruiter"
});

module.exports = Recruiter;
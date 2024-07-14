const sequelize = require("../config/connection");
const { Model, DataTypes } = require("sequelize");

class Application extends Model { }

Application.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "user",
            key: "id"
        }
    },
    job_id: {
        type: DataTypes.INTEGER,
        references: {
            model: "job",
            key: "id"
        }
    }
},{
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: "application"
});

module.exports = Application;
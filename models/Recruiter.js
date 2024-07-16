const sequelize = require("../config/connection");
const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

class Recruiter extends Model { 
    checkPassword(password) {
        return bcrypt.compareSync(password, this.password);
    }
}

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
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    img: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "/imgs/profile-img-default.webp"
    }
},
{
    hooks: {
        beforeCreate: async (newRecruiter) => {
            newRecruiter.password = await bcrypt.hash(newRecruiter.password, 10);
            return newRecruiter;
        }
    },
    sequelize,
    freezeTableName: true,
    timestamps: false,
    modelName: "recruiter"
});

module.exports = Recruiter;
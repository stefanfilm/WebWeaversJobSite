const bcrypt = require("bcrypt");
const sequelize = require("../config/connection");
const { Model, DataTypes } = require("sequelize");

class User extends Model {
    checkPassword(password) {
        return bcrypt.compareSync(password, this.password);
    }
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [5, 30]
        }
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [5, 30]
        }
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6, 32]
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [8, 32]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        }
    },
    job_title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    img: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "/imgs/profile-img-default.webp"
    }},
    {
        hooks: {
            beforeCreate: async (newUser) => {
                newUser.password = await bcrypt.hash(newUser.password, 10);
                return newUser;
            }
        },
        sequelize,
        timestamps: false,
        freezeTableName: true,
        modelName: "user"
    });

module.exports = User;
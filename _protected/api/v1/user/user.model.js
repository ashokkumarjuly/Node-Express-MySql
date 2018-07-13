"use strict";
const async = require('async');
var bcrypt = require('bcryptjs');
const {APP_CONSTANTS} = require('../../config');

module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },

        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                isUnique: function (value, next) {
                    var self = this;
                    User.find({ where: { email: value, accountStatus: { $ne: CONFIG.APP_CONSTANTS.STATUS.USER_STATUS.DELETED } } })
                        .then(function (user) {
                            // reject if a different user wants to use the same email
                            if (user && self.id !== user.id) {
                                return next('Email id is already in use!');
                            }
                            return next();
                        })
                        .catch(function (err) {
                            return next(err);
                        });
                }
            }
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isExist: function (value, next) {
                    var self = this;
                    sequelize.models.Role.find({ where: { name: value } })
                        .then(function (role) {
                            // reject if a different user wants to use the same email
                            if (role) {
                                return next();
                            } else {
                                return next('Role not exists.');
                            }

                        })
                        .catch(function (err) {
                            return next(err);
                        });
                }
            }
        },
        accountStatus: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: "0"
        },
        emailVerified: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: "0"
        },
        authToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lastLoginDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: true,

        }
    }, {
            tableName: 'user',
            "classMethods": {
                generateHash: function (password, cb) {
                    var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(APP_CONSTANTS.JWTCONFIG.saltRounds));
                    // console.log(hash + '-----');
                    //cb(null, hash);
                    return hash;

                    //return hashedPassword = bcrypt.hashAsync(password, bcrypt.genSaltSync(APP_CONSTANTS.JWTCONFIG.saltRounds));
                },

                "associate": function (models) {
                    User.belongsToMany(models.Role, {
                        through: models.UserRole,
                        foreignKey: 'userId'
                    });

                    User.hasMany(models.CustomerUserMap, { foreignKey: 'userId' });
                }
            },
            // instanceMethods: {
            //     verifyPassword: function (password) {
            //         // console.log(this.password);
            //         return bcrypt.compareSync(password, this.password);
            //     }

            // },

        });

    User.prototype.verifyPassword = function (password) {
        // console.log(this.password);
        return bcrypt.compareSync(password, this.password);
    }
    User.beforeCreate(function (model, options, cb) { //Hooks
        //console.log('beforecreate');
        model.email = model.email.toLowerCase();
        var hash = User.generateHash(model.password);
        model.password = hash;

        cb();

    });
    return User;
};

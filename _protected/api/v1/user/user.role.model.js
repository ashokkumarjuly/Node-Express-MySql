"use strict";
module.exports = function (sequelize, DataTypes) {
    const UserRole = sequelize.define('UserRole', {
        role_name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
            tableName: 'user_role',
            timestamps: false,
        });

    return UserRole;
};

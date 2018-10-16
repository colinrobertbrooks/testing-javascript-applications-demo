/* eslint-disable func-names */
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlphanumeric: true,
          isLowercase: true
        }
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      salt: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdAt: {
        field: 'created_at',
        type: DataTypes.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
        defaultValue: new Date()
      }
    },
    {
      tableName: 'users'
    }
  );

  User.associate = function({ Access }) {
    User.belongsToMany(Access, { through: 'UsersAccess', onDelete: 'CASCADE' });
  };

  User.prototype.mapAccessBy = function(mapAttribute) {
    const { Accesses, ...restAttributes } = this.dataValues;

    return {
      ...restAttributes,
      access: Accesses ? Accesses.map(access => access[mapAttribute]) : []
    };
  };

  return User;
};

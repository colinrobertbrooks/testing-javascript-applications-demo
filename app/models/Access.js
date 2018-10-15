/* eslint-disable func-names */
module.exports = (sequelize, DataTypes) => {
  const Access = sequelize.define(
    'Access',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      createdAt: {
        field: 'created_at',
        type: DataTypes.DATE
      },
      updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE
      }
    },
    {
      freezeTableName: true
    }
  );

  Access.associate = function({ User }) {
    Access.belongsToMany(User, {
      through: 'UsersAccess',
      onDelete: 'CASCADE'
    });
  };

  return Access;
};

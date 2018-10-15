module.exports = (sequelize, DataTypes) => {
  const UsersAccess = sequelize.define(
    'UsersAccess',
    {
      UserId: {
        field: 'user_id',
        type: DataTypes.INTEGER,
        references: {
          model: 'User',
          key: 'id'
        }
      },
      AccessId: {
        field: 'access_id',
        type: DataTypes.INTEGER,
        references: {
          model: 'Access',
          key: 'id'
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
      tableName: 'users_access'
    }
  );

  return UsersAccess;
};

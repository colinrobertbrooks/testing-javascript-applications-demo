module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('users_access', {
      UserId: {
        field: 'user_id',
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      AccessId: {
        field: 'access_id',
        type: Sequelize.INTEGER,
        references: {
          model: 'access',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      createdAt: {
        field: 'created_at',
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        field: 'updated_at',
        type: Sequelize.DATE,
        defaultValue: new Date()
      }
    }),

  down: queryInterface => queryInterface.dropTable('users_access')
};

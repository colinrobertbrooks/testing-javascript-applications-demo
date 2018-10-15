module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert(
      'access',
      [
        {
          name: 'Admin'
        },
        {
          name: 'Feature 1'
        },
        {
          name: 'Feature 2'
        }
      ],
      {}
    ),

  down: queryInterface => queryInterface.bulkDelete('access', null, {})
};

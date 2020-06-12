const bcrypt = require('bcrypt');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').truncate()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, username: 'tommyg', password: bcrypt.hashSync('password1', 14), department: 'accounting'},
        {id: 2, username: 'heatherb', password: bcrypt.hashSync('password2', 14), department: 'accounting'},
        {id: 3, username: 'jeffh', password: bcrypt.hashSync('password3', 14), department: 'legal'},
        {id: 4, username: 'jamesj', password: bcrypt.hashSync('password4', 14), department: 'legal'},
        {id: 5, username: 'jessical', password: bcrypt.hashSync('password5', 14), department: 'development'},
        {id: 6, username: 'clairec', password: bcrypt.hashSync('password6', 14), department: 'development'}
      ]);
    });
};

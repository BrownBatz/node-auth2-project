exports.up = function(knex) {
    return knex.schema.createTable('users', tbl => {
        tbl.increments();
        tbl.text('username', 30).unique().notNullable();
        tbl.text('password', 128).notNullable();
        tbl.text('department', 128).notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users');
};


exports.up = function(knex) {
    return knex.schema.createTable('users', function (table) {
        table.increments();
        table.string('name');
        table.string('login').notNullable();
        table.string('password').notNullable();
        table.date('date_of_birth');
        table.timestamps();
    });

};

exports.down = function(knex) {
    return knex.schema
    .dropTable("users");
    
};

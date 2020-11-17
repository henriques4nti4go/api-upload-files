
exports.up = function(knex) {
    return knex.schema.createTable('users', function (table) {
        table.increments();
        table.string('login').notNullable();
        table.string('password').notNullable();
        table.integer('status').notNullable().defaultTo(1);
        table.timestamps(true,true);
    });

};

exports.down = function(knex) {
    return knex.schema
    .dropTable("users");
    
};

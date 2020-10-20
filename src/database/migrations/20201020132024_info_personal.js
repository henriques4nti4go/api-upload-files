
exports.up = function(knex) {
    return knex.schema.createTable('info_personals', function (table) {
        table.increments();
        table.text('description').notNullable();
        table.char('status').notNullable();
        table.integer('user_id').notNullable();
        table.timestamps();
    });
};

exports.down = function(knex) {
    return knex.schema
    .dropTable("info_personals");
};

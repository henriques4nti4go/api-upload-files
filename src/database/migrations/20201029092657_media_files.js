
exports.up = function(knex) {
    return knex.schema.createTable('media_files', function (table) {
        table.increments();
        table.integer('user_id').notNullable();
        table.string('uri').notNullable();
        table.string('key').notNullable();
        table.foreign('user_id').references('id').inTable('users');
        table.timestamps();
    });
};

exports.down = function(knex) {
    return knex.schema
    .dropTable('media_files');
};

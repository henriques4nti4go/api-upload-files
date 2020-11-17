
exports.up = function(knex) {
    return knex.schema.createTable('media_files', function (table) {
        table.increments();
        table.integer('user_id').notNullable();
        table.string('uri').notNullable();
        table.string('key').notNullable();
        table.foreign('user_id').references('id').inTable('users');
        table.integer('status').notNullable().defaultTo(1);
        table.timestamps(true,true);
    });
};

exports.down = function(knex) {
    return knex.schema
    .dropTable('media_files');
};

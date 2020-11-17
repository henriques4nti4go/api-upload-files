
exports.up = function(knex) {
    return knex.schema.createTable('images', function (table) {
        table.increments();
        table.integer('user_id').notNullable();
        table.string('image_uri').notNullable();
        table.foreign('user_id').references('id').inTable('users');
        table.integer('status').notNullable().defaultTo(1);
        table.timestamps(true,true);
    });
};

exports.down = function(knex) {
    return knex.schema
    .dropTable('images');
};

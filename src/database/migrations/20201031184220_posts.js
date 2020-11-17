
exports.up = function(knex) {
    return knex.schema.createTable('posts', function (table) {
        table.increments();
        table.integer('user_id').notNullable();
        table.string('media_id');
        table.text('description').notNullable();
        table.foreign('user_id').references('id').inTable('users');
        table.timestamps();
    });
};

exports.down = function(knex) {
    return knex.schema
    .dropTable('posts');
};

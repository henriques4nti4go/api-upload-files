
exports.up = function(knex) {
    return knex.schema.createTable('photos', function (table) {
        table.increments();
        table.integer('user_id').notNullable();
        table.string('photo').notNullable();
        table.string('description');
        table.foreign('user_id').references('id').inTable('users');
        table.timestamps();
    });
};

exports.down = function(knex) {
    return knex.schema
    .dropTable('photos');
};

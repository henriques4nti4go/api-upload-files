
exports.up = function(knex) {
    return knex.schema.createTable('friends', function (table) {
        table.increments();
        table.integer('user_id').notNullable();
        table.integer('friend_id').notNullable();
        table.integer('status').notNullable().defaultTo(1);
        table.timestamps(true,true);
    });
};

exports.down = function(knex) {
    return knex.schema
    .dropTable('friends');
};

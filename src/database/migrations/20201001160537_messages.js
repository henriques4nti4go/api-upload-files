
exports.up = function(knex) {
    return knex.schema.createTable('messages', function (table) {
        table.increments();
        table.text('message').notNullable();
        table.integer('user_id').notNullable();
        table.timestamps();
    });
  
};

exports.down = function(knex) {
    return knex.schema
    .dropTable("messages");
};


exports.up = function(knex) {
    return knex.schema.createTable('messages', function (table) {
        table.increments();
        table.text('message').notNullable();
        table.integer('user_id').notNullable();
        table.integer('user_target').notNullable();
        table.foreign('user_id').references('id').inTable('users');
        table.integer('status').notNullable().defaultTo(1);
        table.timestamps(true,true);
    });
  
};

exports.down = function(knex) {
    return knex.schema
    .dropTable("messages");
};

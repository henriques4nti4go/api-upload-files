
exports.up = function(knex) {
    return knex.schema.createTable('conversation_messages', function (table) {
        table.increments();
        table.integer('user_id').notNullable();
        table.integer('user_conversation_id').notNullable();
        table.integer('conversation_id').notNullable();
        table.string('message').notNullable();
        table.integer('status').notNullable().defaultTo(1);
        table.foreign('user_conversation_id').references('id').inTable('user_conversations');
        table.timestamps(true,true);
    });
};

exports.down = function(knex) {
    return knex.schema
    .dropTable('conversation_messages');
};

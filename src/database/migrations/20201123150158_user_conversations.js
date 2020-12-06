
exports.up = function(knex) {
    return knex.schema.createTable('user_conversations', function (table) {
        table.increments();
        table.integer('user_id').notNullable();
        table.integer('user_target_id').notNullable();
        table.integer('conversation_id').notNullable();
        table.foreign('conversation_id').references('id').inTable('conversations');
        table.timestamps(true,true);
    });
};

exports.down = function(knex) {
    return knex.schema
    .dropTable('user_conversations');
};

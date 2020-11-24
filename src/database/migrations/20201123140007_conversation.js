
exports.up = function(knex) {
    return knex.schema.createTable('conversations', function (table) {
        table.increments();
        table.timestamps(true,true);
    });
};

exports.down = function(knex) {
    return knex.schema
    .dropTable('conversations');
};

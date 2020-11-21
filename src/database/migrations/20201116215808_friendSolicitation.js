
exports.up = function(knex) {
    return knex.schema.createTable('friendSolicitations', function (table) {
        table.increments();
        table.integer('user_id').notNullable();
        table.integer('solicitation_user_id').notNullable();
        table.timestamps(true,true);
    });
};

exports.down = function(knex) {
    return knex.schema
    .dropTable('friendSolicitations');
};

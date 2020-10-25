
exports.up = function(knex) {
    return knex.schema.createTable('persons', function (table) {
        table.increments();
        table.string('name',100).notNullable();
        table.date('date_of_birth').notNullable();
        table.string('genre',1).notNullable();
        table.string('city',50);
        table.string('country',50);
        table.string('state',50);
        table.text('profile_photo');
        table.integer('user_id').notNullable();
        table.foreign('user_id').references('id').inTable('users');
        table.timestamps();
    });
};

exports.down = function(knex) {
    return knex.schema
    .dropTable("persons");
};

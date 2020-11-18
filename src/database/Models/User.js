const connection = require('../connection');
const { Model } = require('objection');
const Person = require('./Person');

Model.knex(connection);

class Index extends Model {
    static tableName = 'users';

    static relationMappings = {
        person_data: {
          relation: Model.BelongsToOneRelation,
          modelClass: Person,
          join: {
            from: 'users.id',
            to: 'persons.user_id',
          }
        }
    };
}

module.exports = Index;
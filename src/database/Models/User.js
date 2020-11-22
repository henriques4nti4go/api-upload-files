const connection = require('../connection');
const { Model } = require('objection');
const Person = require('./Person');

Model.knex(connection);

class Index extends Model {
    static tableName = 'users';

    static get modifiers() {
      return {
        select(builder) {
          builder.select('login');
        }
      };
    }

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
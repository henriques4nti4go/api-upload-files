const connection = require('../connection');
const { Model } = require('objection');
const User = require('./User');
const Person = require('./Person');

Model.knex(connection);

class Index extends Model {
    static tableName = 'friendSolicitations';

    static relationMappings = {
        user: {
          relation: Model.BelongsToOneRelation,
          modelClass: User,
          join: {
            from: 'friendSolicitations.user_id',
            to: 'users.id',
          }
        },
        person: {
          relation: Model.BelongsToOneRelation,
          modelClass: Person,
          join: {
            from: 'friendSolicitations.user_id',
            to: 'persons.user_id',
          }
        },
    };
}

module.exports = Index;
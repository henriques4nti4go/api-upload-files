const connection = require('../connection');
const { Model } = require('objection');
const User = require('./User');
const Person = require('./Person');

Model.knex(connection);

class Index extends Model {
    static tableName = 'friends';

    static relationMappings = {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'friends.friend_id',
          to: 'users.id',
        }
      },
      person: {
        relation: Model.BelongsToOneRelation,
        modelClass: Person,
        join: {
          from: 'friends.friend_id',
          to: 'persons.user_id',
        }
      }
    };

}

module.exports = Index;
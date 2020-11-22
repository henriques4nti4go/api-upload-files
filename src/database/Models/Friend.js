const connection = require('../connection');
const { Model } = require('objection');
const User = require('./User');

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
        }
    };

}

module.exports = Index;
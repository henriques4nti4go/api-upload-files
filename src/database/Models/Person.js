const connection = require('../connection');
const { Model } = require('objection');
const UserConversation = require('./UserConversation');

Model.knex(connection);

class Index extends Model {
    static tableName = 'persons';

    static relationMappings = {
        conversation_id: {
          relation: Model.BelongsToOneRelation,
          modelClass: UserConversation,
          join: {
            from: 'user_conversations.user_id',
            to: 'persons.user_id',
          }
        }
    };
}

module.exports = Index;
const connection = require('../connection');
const { Model } = require('objection');
const ConversationMessages = require('./ConversationMessages');
Model.knex(connection);

class Index extends Model {
    static tableName = 'user_conversations';

    static relationMappings = {
      conversation: {
        relation: Model.BelongsToOneRelation,
        modelClass: ConversationMessages,
        join: {
          from: 'user_conversations.id',
          to: 'conversation_messages.user_conversation_id',
        }
      },
    };
    static get modifiers() {
        return {
          select(builder) {
            builder.select('conversation_id');
          },
        };
      }
}

module.exports = Index;
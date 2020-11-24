const connection = require('../connection');
const { Model } = require('objection');

Model.knex(connection);

class Index extends Model {
    static tableName = 'user_conversations';

    static get modifiers() {
        return {
          select(builder) {
            builder.select('conversation_id');
          }
        };
      }
}

module.exports = Index;
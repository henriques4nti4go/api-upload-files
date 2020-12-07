const connection = require('../connection');
const { Model } = require('objection');

Model.knex(connection);

class Index extends Model {
    static tableName = 'conversation_messages';
    
    static get modifiers() {
        return {
          returnFirstMessage(builder) {
            builder.select('message','created_at')
            .orderBy('created_at','desc')
            .where({status: 1});
          },
        };
      }
}

module.exports = Index;
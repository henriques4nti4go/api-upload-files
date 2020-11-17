const connection = require('../connection');
const { Model } = require('objection');

Model.knex(connection);

class Index extends Model {
    static get tableName() {
        return 'friends';
    }
}

module.exports = Index;
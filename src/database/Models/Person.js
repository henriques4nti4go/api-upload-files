const connection = require('../connection');
const { Model } = require('objection');

Model.knex(connection);

class Index extends Model {
    static tableName = 'persons';
}

module.exports = Index;
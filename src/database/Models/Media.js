const connection = require('../connection');
const { Model } = require('objection');

Model.knex(connection);

class Images extends Model {
    static get tableName() {
        return 'images';
    }
}

module.exports = Images;
const connection = require('../connection');
const { Model } = require('objection');

Model.knex(connection);

class Images extends Model {
    static tableName = 'media_files';

}

module.exports = Images;
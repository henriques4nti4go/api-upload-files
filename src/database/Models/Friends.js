const connection = require('../connection');
const { Model } = require('objection');
const MediaFiles = require('./MediaFiles');

Model.knex(connection);

class Post extends Model {
    static tableName = 'posts';

    static relationMappings = {
        media: {
          relation: Model.BelongsToOneRelation,
          modelClass: MediaFiles,
          join: {
            from: 'posts.media_id',
            to: 'media_files.id',
          }
        }
    };
}

module.exports = Post;
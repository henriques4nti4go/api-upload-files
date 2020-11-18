class Post extends Model {
    static tableName = '';

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
const connection = require('../database/connection');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const authKey = require('../config/auth.json');
const Token = require('../auth/token');
const aws_credentials = require('../config/aws_credentials.json');
const AWS = require('aws-sdk');
const fs = require('fs');
const getDate = require('../helpers/date');

const Images = require('../database/Models/MediaFiles');
const Post = require('../database/Models/Post');

function functions() {
    const uploadPromise = new AWS.S3({
        apiVersion: '2006-03-01',
        accessKeyId: aws_credentials.id,
        secretAccessKey: aws_credentials.secret_key,
    });

    let bucketName = process.env.BUCKET_MEDIA;

    const uploadPhotos = async function (request, response) {
        const trx = await connection.transaction();
        try {
            const {
                user_id,
                description,
                profile_photo,
            } = request.body;

            const {
                filename,
                path,
            } = request.file;

            let date = getDate;
            
            let {Location,Key} = await uploadImageAws({
                filename: `${filename}.jpeg`,
                path,
            });
            
            
            let media_id = await trx('media_files').insert({
                user_id,
                uri: Location,
                key: Key,
                created_at: date,
                updated_at: date,
            }).returning('id');
            
            await trx('posts').insert({
                user_id,
                media_id: media_id[0],
                description: description,
                created_at: date,
                updated_at: date,
            });
            
            trx.commit();
            return response.json({
                status: 'SUCCESS',
                message: 'image uploaded',

            });

        } catch (error) {
            console.log(error)
            trx.rollback();
            return response.json({status: 'error', message: error});
        }
    }
    
    const uploadImageAws = async function (file) {

        const fileContent = fs.readFileSync(file.path);
        let objectParams = {Bucket: 'old-times-42b6d6fa76e48a', Key: file.filename, Body: fileContent, ACL: "public-read", ContentType: 'image/png'};
        // Create object upload promise
        
        let { Location, Key } = await uploadPromise.upload(objectParams).promise();
        fs.unlinkSync(file.path)
        return {
            Location,
            Key,
        };

    }

    const getMediaFiles = async function (request, response) {
        try {
            const {
                user_target
            } = request.body;
    
            // const img = await Images.query().where('user_id',id).select('*'); 
            const posts = await Post.query()
            .where({user_id: user_target})
            .withGraphFetched('media');
    
            return response.json({
                response: posts, 
                status: 'success'
            });
        } catch (error) {
            console.log(error)
            return response.json({
                response: error,
                status: 'error',
            });
        }
    }
    const deleteMediaFiles = async function (request, response) {
        const trx = await connection.transaction();
        try {
            const {
                user_id,
                post_id,
                key,
            } = request.body;

            let params = {
                Bucket: bucketName,
                Key: key,
            }
            
            let { media_id } = await trx('posts').where('id', post_id).first('media_id');
            await trx('media_files').where('id', media_id).delete();
            await trx('posts').where('id',post_id).delete();
            await uploadPromise.deleteObject(params).promise();

            trx.commit();

            return response.json({
                status: 'success',
                data: [],
            })
            
        } catch (error) {
            console.log(error)
            trx.rollback();
            return
        }
    }
    return{
        uploadPhotos,
        getMediaFiles,
        deleteMediaFiles,
        // index,
        // auth,
        // authenticateWithToken,
    }
}

module.exports = functions();
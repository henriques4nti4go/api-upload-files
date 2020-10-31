const connection = require('../database/connection');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const authKey = require('../config/auth.json');
const Token = require('../auth/token');
const aws_credentials = require('../config/aws_credentials.json');
const AWS = require('aws-sdk');
const fs = require('fs');

function functions() {
    const uploadPhotos = async function (request, response) {
        const trx = await connection.transaction();
        try {
            const {
                token,
                user_id,
                description,
            } = request.body;

            const {
                filename,
                path,
            } = request.file;
            let image_uri = await uploadImageAws({
                filename: `${filename}.jpeg`,
                path,
            });

            let image_id = await trx('images').insert({
                user_id,
                image_uri,
            }).returning('id');
            
            await trx('posts').insert({
                user_id,
                image_id: image_id[0],
                description: description,
            })

            trx.commit();
            return response.json({
                status: true,
                message: 'created',

            });

        } catch (error) {
            console.log(error)
            trx.rollback();
            return response.json({status: 'error', message: error});
        }
    }
    
    const uploadImageAws = async function (file) {
        let bucketName = process.env.BUCKET_MEDIA;
        
        const fileContent = fs.readFileSync(file.path);
        let objectParams = {Bucket: bucketName, Key: file.filename, Body: fileContent, ACL: "public-read", ContentType: 'image/png'};
        // Create object upload promise
        let uploadPromise = new AWS.S3({
            apiVersion: '2006-03-01',
            accessKeyId: aws_credentials.id,
            secretAccessKey: aws_credentials.secret_key,
        });
        let { Location } = await uploadPromise.upload(objectParams).promise();
        fs.unlinkSync(file.path)
        return Location;

    }

    return{
        uploadPhotos,
        // index,
        // auth,
        // authenticateWithToken,
    }
}

module.exports = functions();
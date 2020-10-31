const connection = require('../database/connection');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const authKey = require('../config/auth.json');
const Token = require('../auth/token');
const aws_credentials = require('../config/aws_credentials.json');
const AWS = require('aws-sdk');

function functions() {
    const uploadPhotos = async function (request, response) {
        const trx = await connection.transaction();
        try {
            const {
                token,
                id,
                photo,
            } = request.body;
            console.log(JSON.stringify(photo))
            
            // await uploadImageAws();
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
    
    const uploadImageAws = async function (params) {
        let bucketName = 'node-sdk-sample-asldalsdlaskdl';
        let objectParams = {Bucket: bucketName, Key: 'asdasld.txt', Body: 'Hello World!'};
        // Create object upload promise
        let uploadPromise = new AWS.S3({
            apiVersion: '2006-03-01',
            accessKeyId: aws_credentials.id,
            secretAccessKey: aws_credentials.secret_key,
        });
        
        uploadPromise.putObject(objectParams).promise().then((data) => {
            console.log('enviado')
        });
        

    }

    return{
        uploadPhotos,
        // index,
        // auth,
        // authenticateWithToken,
    }
}

module.exports = functions();
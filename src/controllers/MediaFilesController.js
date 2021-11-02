
const bcrypt = require('bcryptjs');
const crypto = require('crypto')
require('dotenv').config();
const jwt = require('jsonwebtoken');
const fs = require('fs');

// const Images = require('../database/Models/MediaFiles');
// const Post = require('../database/Models/Post');

function functions() {

    function generateDatabase(data){
        fs.writeFile("src/database/database.json", JSON.stringify(data), function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        }); 
    }

    const uploadPhotos = async function (request, response) {
        
            const {
                user_id,
                description,
                profile_photo,
            } = request.body;

            const {
                filename,
                path,
            } = request.file;
            const database = require('../database/database.json');
            database.push({
                id:crypto.randomUUID(),
                file: path
            });
            generateDatabase(database);
            return response.json({
                status: 'file uploaded!'
            })
    }
    
    const getMediaFiles = async function (request, response) {
        
        return response.json(require('../database/database.json'));
    }
    const deleteMediaFiles = async function (request, response) {
        
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
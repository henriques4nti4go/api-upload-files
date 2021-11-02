
const bcrypt = require('bcryptjs');
const crypto = require('crypto')
require('dotenv').config();
const jwt = require('jsonwebtoken');
const fs = require('fs');

// const Images = require('../database/Models/MediaFiles');
// const Post = require('../database/Models/Post');

function functions() {
    function validateUser(user,passsword) {
        const json = require('../database/users.json');
        let status = false;
        let user_valid;
        json.forEach(element => {
            if (element.email == user && element.password == passsword) {
                status = true;
                user_valid = element;
            }
        });
        return {
            status,
            user:user_valid
        };
    }

    function generateDatabase(data){
        fs.writeFile("src/database/database.json", JSON.stringify(data), function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        }); 
    }

    function setUser(data){
        let user = require('../database/users.json');
        user.push(data)
        fs.writeFile("src/database/users.json", JSON.stringify(user), function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        }); 
    }

    function register(request,response){
        const {
            username,
            email,
            password,
        } = request.body;
        let user = {
            username,
            email,
            password,
            id:crypto.randomUUID()
        };
        setUser(user);
        return response.json({
            status: 'registered',
            user
        })
    }

    function login(request,response){
        const {
            username,
            email,
            password,
        } = request.body;

        
        
        const auth = validateUser(email,password);
        if (!auth.status) return response.json({
            status: 'error'
        });
        return response.json({
            status: 'success',
            user: auth.user
        })
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
        login,
        register,
        // index,
        // auth,
        // authenticateWithToken,
    }
}

module.exports = functions();
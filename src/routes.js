const express = require('express');
const crypto = require('crypto');
// const connection = require('./database/connection.js');
const users = require('./controllers/UserController');
const message = require('./controllers/MessageController');
const media = require('./controllers/MediaController');
const auth = require('./controllers/AuthController');
const route = express.Router();
const jwt  = require('jsonwebtoken');
const authKey = require('./config/auth.json');
const multer = require('multer');

const multerConfig = require('./config/multer');

route.get('/', (req, res) => {
    return res.json({message: 'ok'})
});


/**
 * @login
 * 
 * @params
 * name: String 
 * login: String Required
 * 
 * @return
 * status: String
 * message: String
 */

route.post('/api/auth/login', auth.login);

/**
 * @register
 * 
 * @params
 * name: String Required
 * login: String Required
 * password: String Required
 * date_of_birth: Date Required
 * 
 * @return
 * status: String
 * message: String
 */
route.post('/api/user/register', users.register);

/**
 * @profile_edit
 * 
 * @params
 * token: String Required
 * name: String Required
 * login: String Required
 * password: String Required
 * date_of_birth: Date 
 * genre: Integer
 * city: String
 * state: String
 * country: String
 * profile_photo: String
 * 
 * @return
 * status: Boolean
 * message: String
 */


// route.use(auth.authenticateWithToken);
route.post('/api/user/updateProfile', users.updateProfile);

route.post('/api/user/uploadPhotos',multer(multerConfig).single('image'), media.uploadPhotos);




module.exports = route;
const express = require('express');
const crypto = require('crypto');
// const connection = require('./database/connection.js');
const users = require('./controllers/UserController');
const message = require('./controllers/MessageController');
const auth = require('./controllers/AuthController');
const route = express.Router();
const jwt  = require('jsonwebtoken');
const authKey = require('./config/auth.json');

route.get('/', (req, res) => {
    return res.json({message: 'ok'})
});


/**
 * @login
 * 
 * @params
 * name: String 
 * login: String Required
 * password: String Required
 * date_of_birth: Date
 * 
 * @return
 * status: String
 * message: String
 */
// route.post('/api/user/login',users.auth);

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

route.post('/api/auth/login', auth.login);
route.use(auth.authenticateWithToken);




module.exports = route;
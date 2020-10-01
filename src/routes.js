const express = require('express');
const crypto = require('crypto');
// const connection = require('./database/connection.js');
const users = require('./controllers/UserController');
const route = express.Router();
const jwt  = require('jsonwebtoken');
const authKey = require('./config/auth.json');
const { networkInterfaces } = require('os');

route.get('/', (req, res) => {
    return res.json({message: 'ok'})
});

route.post('/api/auth/login',users.auth);
route.post('/api/auth/register', users.store);
route.post('/api/users/', users.authenticateWithToken, users.index)
route.post('/api/message/', users.authenticateWithToken,users.sendMessage)



module.exports = route;
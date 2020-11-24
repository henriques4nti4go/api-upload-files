const express = require('express');
const crypto = require('crypto');
// const connection = require('./database/connection.js');
const users = require('./controllers/UserController');
const message = require('./controllers/MessageController');
const media = require('./controllers/MediaFilesController');
const auth = require('./controllers/AuthController');
const friends = require('./controllers/InteractionController');
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
 * genre: Integer Required
 * @return
 * status: String
 * message: String
 */
route.post('/api/user/register', users.register);

route.use(auth.authenticateWithToken);

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
route.post('/api/user/updateProfile', users.updateProfile);

route.use(auth.authenticateWithToken);
route.post('/api/user/updateProfile', users.updateProfile);
route.post('/api/user/friends/sendSolicitation', friends.sendFriendSolicitation);
route.post('/api/user/friends/cancelSolicitation', friends.cancelFriendSolicitation);
route.post('/api/user/friends/getSolicitation', friends.getFriendSolicitation);
route.post('/api/user/friends/responseSolicitation', friends.responseFriendSolicitation);
route.post('/api/user/friends/hasSolicitation', friends.hasSendFriendSolicitation);
route.post('/api/user/friends', friends.getFriends);
route.post('/api/user/friends/cancelFriendship', friends.cancelFriendship);

/**
 * @are_friends
 * 
 * @method
 * POST
 * 
 * @params
 * token: String Required
 * user_id: integer Required
 * solicitation_user_id: Integer Required
 * 
 * @return
 * status: String
 * message: String
 * response: Boolean
 */

route.post('/api/user/friends/areFriends', friends.areFriends);

/**
 * @search_user
 * 
 * @params
 * token: String Required
 * user_id: integer Required
 * user_name: String Required
 * 
 * @return
 * status: String
 * message: String
 * response: Object
 */

route.post('/api/user/search/user', users.searchUser);


/**
 * @get_profile
 * 
 * @method 
 * POST
 * @params
 * token: String Required
 * user_id: integer Required
 * user_target: Integer String
 * 
 * @return
 * status: String
 * message: String
 * response: Object
 */

route.post('/api/user/profile/get', users.getProfile);

route.post('/api/user/messages/send', message.sendMessage);


route.post('/api/user/uploadPhotos',multer(multerConfig).single('image'), media.uploadPhotos);
route.post('/api/user/getMediaFiles', media.getMediaFiles);
route.post('/api/user/deleteMediaFiles', media.deleteMediaFiles);
route.post('/api/user/setProfileImage', users.setProfileImage);




module.exports = route;
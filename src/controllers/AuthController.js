require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authKey = require('../config/auth.json');
const Token = require('../auth/token');
const connection = require('../database/connection');

function functions() {
    const authenticateWithToken = async function (request, response, next) {
        try {
            const req = request.headers;
            const token = req['auth-token'];
            let user_id;
            if (req['user_id']) user_id = req['user_id'];
            if (request.body['user_id']) user_id = request.body['user_id'];

            if (!token) {
                return response.json({
                    message: 'you need to authenticate',
                });
            }
            
            let auth = jwt.verify(token,authKey.SECRET_KEY);
            
            if (auth.id != user_id) {
                return response.json({
                    status: 'ERROR TOKEN',
                    message: 'token does not belong to the user',
                })
            }
            
            next();
    
        } catch (error) {
            return response.json({
                message: 'an error has occurred of authentication token',
                error,
            })
        }
    }

    
    const login = async function (request, response) {
        try {
            const {
                login,
                password,
                notification_token,
            } = request.body;

            let table = await connection('users').where({login}).first('id', 'login', 'password');

            
            if (!table) {
                return response.json({
                    message: 'user not found',
                    state: false,
                });
            }
            let person_data = await connection('persons').where({id: table.id}).first('*');
            
            if (!bcrypt.compare(password,table.password)) {
                return response.json({
                    message: 'incorrect password',
                    state: false,
                })
            }

            if (notification_token) {
                await connection('users')
                .where({login})
                .update({notification_token});
            }

            let token = await Token.generate({
                id: table.id,
                login: table.login,
                password: table.password,
            });
            
            return response.json({
                status: 'SUCCESS',
                user: table,
                token,
                state: true,
                person_data,
            })
            
        } catch (error) {
            return response.json({
                message: 'an error has occurred',
                error,
                state: false,
                status: 'ERROR',
            })
        }
    }


    return{
        authenticateWithToken,
        login,
    }
}

module.exports = functions();
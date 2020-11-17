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
            
            if (!token) {
                return response.json({
                    message: 'you need to authenticate',
                });
            }
    
            let auth = jwt.verify(token,authKey.SECRET_KEY);
            if (auth) next();
    
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

            

            let token = await Token.generate({
                login: table.login,
                password: table.password,
            });
            
            return response.json({
                user: table,
                token,
                state: true,
                person_data,
            })
            
        } catch (error) {
            return response.json({
                message: 'an error has occurred',
                error,
                state: false
            })
        }
    }


    return{
        authenticateWithToken,
        login,
    }
}

module.exports = functions();
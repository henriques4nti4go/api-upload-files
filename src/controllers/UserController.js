const connection = require('../database/connection');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Token = require('../auth/token');

function functions() {

    const index = async function (request,response) {
        let table = await connection('users').select('id','name','login');

        return response.json({message: table}); 
    
    }

    const store = async function (request, response) {
        try {
            const {
                name, 
                login, 
                date_of_birth,
                password,
            } = request.body;

            let date = new Date().toLocaleString();
            let isUser = await verifyUser(login);
            
            if (isUser.status) 
                return response.json({
                    status: '200',
                    message: 'user already exists',
                });

            password_crypt = await bcrypt.hash(password, 10);
            
            await connection('users').insert({
                name,
                login,
                password: password_crypt,
                date_of_birth,
                created_at: date,
                updated_at: date,
            });

            return response.json({
                status: '201',
                message: 'created',
            });

        } catch (error) {
            console.log(error)
            return response.json({message: 'erro'})
        }
    }
    
    const auth = async function (request, response, next) {
        try {
            const {
                login,
                password,
            } = request.body;
            
            let table = await connection('users').where({login}).first('id', 'login', 'password');
            
            if (!table) {
                return response.json({
                    message: 'user not found',
                });

            }

            if (!bcrypt.compare(password,table.password)) {
                return response.json({
                    message: 'incorrect password',
                })
            }

            let token = await Token.generate(table.id);
            
            return response.json({
                id: table.id,
                token
            })
            
        } catch (error) {
            return response.json({
                message: 'an error has occurred',
                error,
            })
        }
    }

    const verifyUser = async function (login) {
        let response = await connection('users').where({login:login}).first('id');
        let status = false;

        if (response) {
            status = true;
        }

        return{
            data: response,
            status,
        }

    }

    return{
        store,
        index,
        auth,
    }
}

module.exports = functions();
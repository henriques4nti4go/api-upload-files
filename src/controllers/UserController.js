const connection = require('../database/connection');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const Token = require('../auth/token');

function functions() {

    const index = async function (request,response) {
        let table = await connection('users').select('*');

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
                status: '200',
                message: 'ok',
            });

        } catch (error) {
            console.log(error)
            return response.json({status: 'erro'})
        }
    }
    
    const verifyUser = async function (login) {
        let response = await connection('users').insert({
            name,
            created_at: date,
            updated_at: date,
        });
    }

    return{
        store,
        index,
    }
}

module.exports = functions();
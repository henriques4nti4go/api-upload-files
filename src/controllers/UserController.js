const connection = require('../database/connection');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const authKey = require('../config/auth.json');
const Token = require('../auth/token');
const getDate = require('../helpers/date');
const User = require('../database/Models/User');

function functions() {
    const register = async function (request, response) {
        const trx = await connection.transaction();

        try {
            const {
                name, 
                login, 
                date_of_birth,
                password,
                genre
            } = request.body;

            let date = getDate;
            
            let isUser = await verifyUser(login);
            
            if (isUser.status) 
                return response.json({
                    status: '200',
                    message: 'user already exists',
                });

            password_crypt = await bcrypt.hash(password, 10);
            
            let table = await trx('users').returning('id').insert({
                login,
                password: password_crypt,
            });

            await trx('persons').insert({
                user_id: table[0],
                name,
                date_of_birth: date_of_birth,
                genre,
            })

            trx.commit();
            return response.json({
                status: true,
                message: 'created',
            });

        } catch (error) {
            trx.rollback();
            console.log(error);
            return response.json({status: 'error', message: error});
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

    const updateProfile = async function (request, response) {
        const trx = await connection.transaction();

        try {
        
            const {
                name, 
                login, 
                date_of_birth,
                password,
                genre,
                city,
                state,
                country,
                profile_photo,
                token,
            } = request.body;

            let date = getDate;
            let auth = require('../config/auth.json');
            let decoded = jwt.verify(token,auth.SECRET_KEY);
            
            if (password !== decoded.password) {
                return response.json({
                    message: 'incorrect token',
                })
            }
            
            // let date = new Date().toLocaleString();
            let isUser = await trx('users').where({login:login}).first('*');

            let person = await trx('persons').where({user_id: isUser.id}).first('*');
            
            await trx('persons').where({user_id: isUser.id}).update({
                name: name ? name : person.name,
                date_of_birth: date_of_birth ? date_of_birth : person.date_of_birth,
                genre: genre ? genre : person.genre,
                city: city ? city : person.city,
                state: state? state : person.state,
                country: country ? country : person.country,
                profile_photo: profile_photo ? profile_photo : person.profile_photo,
                updated_at: date,
            })

            // password_crypt = await bcrypt.hash(password, 10);
            let updated_user = await trx('persons').where({user_id: isUser.id}).first('*');
            trx.commit();
            return response.json({
                status: true,
                message: 'updated',
                updated_user,
            });

        } catch (error) {
            console.log(error)
            trx.rollback();
            return response.json({status: 'error', message: error});
        }
    }

    const setProfileImage = async function (request, response) {
        let {
            user_id,
        } = request.body;

        await connection('persons')
        .update()

    }

    const searchUser = async function (request, response) {
        try {
        
            const {
                user_id,
                user_name, 
            } = request.body;

            let rows = [];
            
            if (user_name) {
                rows = await connection('persons')
                .innerJoin('users','user_id','=','users.id')
                .where('user_id','<>',user_id)
                .whereRaw(`name like '${user_name}%'`)
                .select('users.login','persons.*');
            }
            return response.json({
                status: 'SUCCESS',
                message: 'users search!',
                response: rows,
            });

        } catch (error) {
            console.log(error)
            return response.json({status: 'ERROR', message: error});
        }
    }

    const getProfile = async function (request, response) {
        try {
        
            const {
                user_target, 
            } = request.body;
            
            let data = await connection('persons')
            .innerJoin('users','user_id','=','users.id')
            .where({user_id: user_target})         
            .first('users.login','persons.*');
            
            return response.json({
                status: 'SUCCESS',
                message: 'profile user!',
                response: data,
            });

        } catch (error) {
            console.log(error)
            return response.json({status: 'ERROR', message: error});
        }
    }


    return{
        register,
        updateProfile,
        setProfileImage,
        searchUser,
        getProfile,
        // index,
        // auth,
        // authenticateWithToken,
    }
}

module.exports = functions();
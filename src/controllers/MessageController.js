const connection = require('../database/connection');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const authKey = require('../config/auth.json');
const Token = require('../auth/token');

function functions() {

    const sendMessage = async function (request, response) {
        try {
            const {
                user_id,
                message,
            } = request.body;

            await connection('messages').insert({
                user_id,
                message,
                created_at: getDate(),
                updated_at: getDate(),
            });

            return response.json({
                message: 'created',
            })

        } catch (error) {
            response.json({
                message: 'on erro has ocurred',
                error,
            })
        }
    }

    const showMessages = async function (request, response) {
        try {

            let table = await connection('messages').select('*');
            // console.log(table)
            return response.json({
                messages: table,
                state: true
            })
            
        } catch (error) {
            return response.json({
                message: 'on error has ocurred',
                error,
                state: false
            })
        }
    }

    const getDate = function () {
        return new Date().toLocaleString();
    }

    return{
        sendMessage,
        showMessages
    }
}

module.exports = functions();
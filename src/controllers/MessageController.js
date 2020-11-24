const connection = require('../database/connection');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const authKey = require('../config/auth.json');
const Token = require('../auth/token');

function functions() {

    const sendMessage = async function (request, response) {
        const trx = await connection.transaction();
        try {
            let {
                user_id,
                user_target,
                conversation_id,
                message,
            } = request.body;

            if (!conversation_id) {
               let conversation = await trx('conversations').insert({}).returning('id');
                conversation_id = conversation[0];
            }
            
            let user_conversation = await  trx('user_conversations')
            .where({conversation_id})
            .where({user_id})
            .first('*');

            if (!user_conversation) {
                user_conversation = await trx('user_conversations')
                .insert({
                    conversation_id,
                    user_id,
                })
                .returning('*');

                await trx('user_conversations')
                .insert({
                    conversation_id,
                    user_id: user_target,
                })
                .returning('id');
            }

            let conversation_message = await trx('conversation_messages')
            .insert({
                user_id,
                user_conversation_id: user_conversation[0].id,
                conversation_id,
                message,
            });

            return console.log(conversation_message)

            trx.commit();
            return response.json({
                message: 'created',
            })

        } catch (error) {
            console.log(error)
            trx.rollback();
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

    return{
        sendMessage,
        showMessages
    }
}

module.exports = functions();
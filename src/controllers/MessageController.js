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
                message,
            } = request.body;
            
            let { conversation_id } = await trx('user_conversations')
            .first('conversation_id')
            .whereIn('user_id',[user_id, user_target]);
            
            let user_conversation = await  trx('user_conversations')
            .where({conversation_id})
            .where({user_id})
            .first('id');

            await trx('conversation_messages')
            .insert({
                user_id,
                user_conversation_id: user_conversation.id,
                conversation_id,
                message,
            }).returning('*');

            trx.commit();
            return response.json({
                status: 'SUCCESS',
                message: 'message send',
            })

        } catch (error) {
            console.log(error)
            trx.rollback();
            response.json({
                status: 'ERROR',
                message: 'on erro has ocurred',
                error,
            })
        }
    }

    const getMessages = async function (request, response) {
        const trx = await connection.transaction();
        try {
            let {
                user_id,
                user_target,
                message,
            } = request.body;

            let conversation_id;

            let data = await trx('user_conversations')
            .first('*')
            .whereIn('user_id',[user_id, user_target]);
            
            if (data) {
                conversation_id = data.conversation_id;
            } else {
                conversation_id = (await trx('conversations').insert({}).returning('id'))[0];
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
                .returning('id');

                await trx('user_conversations')
                .insert({
                    conversation_id,
                    user_id: user_target,
                })
                .returning('id');
            }

            let conversation_message = await trx('conversation_messages')
            .select('conversation_messages.*','users.login')
            .innerJoin('users','user_id','=','users.id')
            .orderBy('created_at', 'desc')
            .where({conversation_id})
            // console.log(conversation_message)
            trx.commit();
            return response.json({
                status: 'SUCCESS',
                message: 'messages gets',
                response: conversation_message,
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

    const getConversations = async function (request, response) {
        try {
            let {
                user_id,
            } = request.body;

            let user_conversation = await connection('user_conversations')
            .first('*')
            .where({user_id});

            let conversation = await connection('user_conversations')
            .first('*')
            .where({conversation_id: user_conversation.conversation_id})
            .where('user_id','<>',user_id)
            console.log(conversation)
            return response.json({
                status: 'SUCCESS',
                message: 'your conversations',
                state: true,
                response: conversation,
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
        getConversations,
        getMessages
    }
}

module.exports = functions();
const connection = require('../database/connection');
require('dotenv').config();

function functions() {
    const sendFriendSolicitation = async function (request, response) {
        
        try {
            const {
                user_id,
                solicitation_user_id,
            } = request.body;
            let solicitation = await connection('friendSolicitations')
            .where({solicitation_user_id}).first('id');

            if (solicitation) return response.json({
                status: 'ERROR',
                message: 'you already sent a solicitation'
            });

            await connection('friendSolicitations').insert({
                user_id,
                solicitation_user_id,
            }).returning('id');

            return response.json({
                status: 'SUCCESS',
                message: 'solicitation send!'
            })
        } catch (error) {
            response.json({
                status: 'ERROR',
                message: 'on erro has ocurred',
                error,
            })
        }
    }

    const getFriendSolicitation = async function (request, response) {
        
        try {
            const {
                user_id,
            } = request.body;

            const solicitations = await connection('friendSolicitations')
            .where({user_id})
            .select('*');

            return response.json({
                status: 'SUCCESS',
                message: '',
                data: solicitations,
            })
        } catch (error) {
            response.json({
                status: 'ERROR',
                message: 'on erro has ocurred',
                error,
            })
        }
    }

    const responseFriendSolicitation = async function (request, response) {
        const trx = await connection.transaction();
        try {
            const {
                solicitation_id,
                user_id,
                response,
            } = request.body;

            let { solicitation_user_id } = await trx('friendSolicitations')
            .where({
                id: solicitation_id,
                user_id,
                status: 1,
            })
            .update({status: response})
            .returning('solicitation_user_id');

            if (solicitation_user_id) {
                await trx('friends').insert({
                    user_id,
                    friend_id: solicitation_user_id
                });
            }
            trx.commit();
            return response.json({
                status: 'SUCCESS',
                message: 'solicitation response!'
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

    const getFriends = async function (request, response) {
        
        try {
            const {
                user_id,
            } = request.body;
            

            const friends = await connection('friends')
            .where({user_id, status:1})
            .select('*');
            return console.log(friends)
            return response.json({
                status: 'SUCCESS',
                message: 'your friends!',
                data: friends,
            })
        } catch (error) {
            console.log(error);
            response.json({
                status: 'ERROR',
                message: 'on erro has ocurred',
                error,
            })
        }
    }
    
    return {
        sendFriendSolicitation,
        getFriendSolicitation,
        responseFriendSolicitation,
        getFriends
    }
}

module.exports = functions();
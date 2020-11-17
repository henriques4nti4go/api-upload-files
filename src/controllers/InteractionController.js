const connection = require('../database/connection');
require('dotenv').config();
const Friends = require('../database/Models/Friends');

function functions() {
    const sendFriendSolicitation = async function (request, response) {
        
        try {
            const {
                user_id,
                solicitation_user_id,
            } = request.body;
            let solicitation = await connection('friendSolicitations')
            .where({solicitation_user_id,user_id}).first('id');

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
            .where({solicitation_user_id: user_id, status: 1})
            .select('*');

            return response.json({
                status: 'SUCCESS',
                message: '',
                response: solicitations,
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
                solicitation_response,
            } = request.body;

            let solicitation = await connection('friendSolicitations')
            .where({
                id: solicitation_id,
                status: 1,
            })
            .update({status: 0})
            .returning('*');

            if (solicitation_response) {
                if (solicitation[0].id) {
                    await trx('friends').insert({
                        user_id: solicitation[0].user_id,
                        friend_id: solicitation[0].solicitation_user_id,
                    });
                    await trx('friends').insert({
                        user_id: solicitation[0].solicitation_user_id,
                        friend_id: solicitation[0].user_id,
                    });
                }
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
            .where({user_id})
            .select('*');

            return response.json({
                status: 'SUCCESS',
                message: 'your friends!',
                response: friends,
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
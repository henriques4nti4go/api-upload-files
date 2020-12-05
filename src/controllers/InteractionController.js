const { where } = require('../database/connection');
const connection = require('../database/connection');
require('dotenv').config();
const Friend = require('../database/Models/Friend');
const FriendSolicitation = require('../database/Models/FriendSolicitation');

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
                message: 'solicitation send!',
            })
        } catch (error) {
            response.json({
                status: 'ERROR',
                message: 'on erro has ocurred',
                error,
            })
        }
    }

    const cancelFriendSolicitation = async function (request, response) {
            try {
                const {
                    user_id,
                    solicitation_user_id,
                } = request.body;
                
                await connection('friendSolicitations')
                .delete({
                    user_id,
                    solicitation_user_id,
                });
                
                return response.json({
                    status: 'SUCCESS',
                    message: 'solicitation canceled!'
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

            const solicitations = await FriendSolicitation.query()
            .where({solicitation_user_id: user_id})
            .withGraphFetched('user')
            .withGraphFetched('person');
            // console.log(solicitations)
            return response.json({
                status: 'SUCCESS',
                message: '',
                response: solicitations,
            })
        } catch (error) {
            console.log(error)
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
            
            let solicitation = await trx('friendSolicitations')
            .where({
                id: solicitation_id,
            })
            .first('*');
            let friendship = await trx('friends')
            .where({
                user_id: solicitation.user_id,
                friend_id: solicitation.solicitation_user_id,
            })
            .first('id');
            if (solicitation_response) {
                if (solicitation.id && !friendship) {
                    await trx('friends').insert({
                        user_id: solicitation.user_id,
                        friend_id: solicitation.solicitation_user_id,
                    });
                    await trx('friends').insert({
                        user_id: solicitation.solicitation_user_id,
                        friend_id: solicitation.user_id,
                    });
                }
            }

            await trx('friendSolicitations')
            .where({id: solicitation.id})
            .delete();

            trx.commit();
            
            return response.json({
                status: 'SUCCESS',
                message: 'solicitation response!'
            })
        } catch (error) {
            console.log(error);
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
            
       
            friends = await Friend.query()
            .where({user_id})
            .withGraphFetched('user(select)')
            .withGraphFetched('person');
            
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

    const hasSendFriendSolicitation = async function (request, response) {
        
        try {
            const {
                user_id,
                solicitation_user_id,
            } = request.body;
            let response_solicitation = 'HAVE_SOLICITATION';

            // verificon se há solicitacao
            let friends = await connection('friendSolicitations')
            .where({user_id})
            .where({solicitation_user_id: solicitation_user_id})
            .first('id');
            if (!friends) response_solicitation = 'NO_HAVE_SOLICITATION';
            //não retornando algo, eu inverto os valores para ver se há solicitacao
            if (!friends) {
                friends = await connection('friendSolicitations')
                .where({user_id: solicitation_user_id})
                .where({solicitation_user_id: user_id})
                .first('id');
                // se achar algo invertendo so valores quer dizer que aquele usuario tem uma solicitacao para responder
                if (friends) response_solicitation = 'RESPONSE_SOLICITATION'; 
            }

            return response.json({
                status: response_solicitation,
                message: 'you have a solicitation',
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

    const cancelFriendship = async function (request, response) {
        
        try {
            const {
                user_id,
                friend_id,
            } = request.body;
            
            await connection('friends')
            .where({user_id})
            .where({friend_id: friend_id})
            .delete();

            const friends = await connection('friends')
            .where({user_id: friend_id})
            .where({friend_id: user_id})
            .delete();

            return response.json({
                status: 'SUCCESS',
                message: 'friendship canceled!',
                // response: ,
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

    const areFriends = async function (request, response) {
        
        try {
            const {
                user_id,
                solicitation_user_id,
            } = request.body;
            
            const friends = await connection('friends')
            .where({user_id})
            .where({status: 1})
            .where({friend_id: solicitation_user_id})
            .first('id');

            let data = friends? true : false;

            return response.json({
                status: 'SUCCESS',
                message: 'your friends!',
                response: data,
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
        getFriends,
        hasSendFriendSolicitation,
        areFriends,
        cancelFriendSolicitation,
        cancelFriendship
    }
}

module.exports = functions();
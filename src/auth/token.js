const JWT = require('jsonwebtoken');
require('dotenv').config();
const authConfig = require('../config/auth.json');

function token() {
    async function generate(payload) {
        return new Promise((resolve, reject) => {
            let tk = JWT.sign(
                payload,
                authConfig.SECRET_KEY
            );
            resolve(tk);
        })
    };

    return{
        generate,
    }
    
}

module.exports = token();
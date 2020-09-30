const JWT = require('jsonwebtoken');
require('dotenv').config();

function token() {
    async function generate(payload) {
        return new Promise((resolve, reject) => {
            let tk = JWT.sign(
                payload,
                process.env.SECRET_KEY
            );
            resolve(tk);
        })
    };

    return{
        generate,
    }
    
}

module.exports = token();
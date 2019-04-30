const config = require('../services/config');

var distance = require('google-distance');
distance.apiKey = config.google_api_key;



// distance api matrix
exports.getDistance = (option1) => {
    return new Promise((res,rej)=>{
        distance.get(option1,(err, data) =>{
            if (err) {
                rej(err);
            } else {
                res(data);
            }    
        });
    })
}


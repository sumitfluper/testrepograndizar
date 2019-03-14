var { serviceModel } = require('../models/service_model')
var Joi = require('joi')
var responses = require('../modules/responses')
var auth = require('../modules/auth')
var status = require('../modules/status')

/*--------------------------------------
+++++++++ SERVICE_REQUIRE API ++++++++++++
---------------------------------------*/
exports.service_require  = async(req, res) => {
    try{
        const schema = Joi.object().keys({
            service_type : Joi.number().required(),
            pickup_address : Joi.string().required(),
            pickup_latitude : Joi.string().required(),
            pickup_longitude : Joi.string().required(),
            drop_address : Joi.string().required(),
            drop_latitude : Joi.string().required(),
            drop_longitude :Joi.string().required(),
            start_time : Joi.string().required(),
            end_time : Joi.string().required(),
            comments : Joi.string().required(),
        })
    
        const result = Joi.validate(req.body, schema, {abortEarly: true});
        if(result.error) {
            if (result.error.details && result.error.details[0].message) {
                res.status(status.BAD_REQUEST).json({ message: result.error.details[0].message });
            } else {
                res.status(status.BAD_REQUEST).json({ message: result.error.message });
            }
            return;
        }
    
        var { service_type, pickup_address, pickup_latitude, pickup_longitude, drop_address, drop_latitude, drop_longitude, comments, start_time, end_time} = req.body
        //let allData = req.body
        //let access_token = req.user.access_token;
        console.log(req.body)
        if(service_type === "1"){
            let pickup_location = { type : 'Point', "coordinates": [pickup_longitude,pickup_latitude]}
            let drop_location = { type : 'Point', "coordinates": [drop_longitude,drop_latitude]}  
            let updateData = { service_type, pickup_address, pickup_latitude, pickup_longitude, drop_address, drop_latitude, drop_longitude, comments, pickup_location, drop_location, start_time, end_time }
            let user = new serviceModel(updateData)
            let userData = await user.save()
            if(userData){
                res.status(200).json({ message : "Order submit successfully", response : userData})
            } else{
                res.status(status.INVALID_CREDENTIAL).json( { message : "Unable to order, Try again after some time"})
            }
        } else if(service_type === "2") {
            res.send("work in progress!!")
        } else {
            res.status(status.BAD_REQUEST).json({ message : "Try again"})
        }
    }catch(error){
        responses.sendError(error.message, res)
    }
}

/*--------------------------------------
+++++++++ GET NEARBY OUTLETS ++++++++++++
---------------------------------------*/

exports.get_nearby_outlets = async (req,res) => {
    try{
        var { pickup_address, pickup_latitude, pickup_longitude } = req.body
        
        let userData = await serviceModel.find(
            { pickup_location: 
                {$nearSphere:
                    {
                        $geometry: { type : "Point", coordinates: [pickup_longitude,pickup_latitude] },
                        $maxDistance:50000
                    }
                } 
            })
            if(userData) {
                var data = [
                    {
                        "outlet" : "McDonald",
                        "Address" : "saudi-11021",
                        "Phone_number" : "7894561230"
                    },
                    {
                        "outlet" : "McDonald",
                        "Address" : "saudi-11021",
                        "Phone_number" : "7894524530"
                    },
                    {
                        "outlet" : "McDonald",
                        "Address" : "saudi arabia-1105021",
                        "Phone_number" : "125856430"
                    }
                ]
                res.status(200).json({ response: data})
            } else{
                res.status(status.NOT_FOUND).json({ message:"Data not found!"})
            }
    }catch(error) {
        responses.sendError(error.message, res)
    }
}

exports.active_captains = async (req,res)=> {
    try{
        var { pickup_latitude, pickup_longitude} = req.body

        //delivery captains in the range of 50 kms
        let userData = await serviceModel.find(
            {pickup_location:
                {$nearSphere:
                    {
                        $geometry: {type:"Point", coordinates:[pickup_longitude,pickup_latitude],
                        $maxDistance:50000
                        }
                    }
                }
        })
        if(userData.length === 0){
            res.send('0')
        } else{
            let delivery_captains_50 = userData.length;
            let updateData = { delivery_captains_50 }

            let user = new serviceModel(updateData)
            let userResult =await user.save()
            res.json({ response : userResult })
        }

        //delivery captains in the range of 100 kms
        let data = await serviceModel.find(
            {pickup_location:
                {$nearSphere:
                    {
                        $geometry: {type:"Point", coordinates:[pickup_longitude,pickup_latitude],
                        $maxDistance:100000
                        }
                    }
                }
        })
        if(data.length === 0){
            res.json({ response : "0"})
        } else{
            let delivery_captains_100 = data.length;
            let updateData = { delivery_captains_100 }

            let user = new serviceModel(updateData)
            let userResult = await user.save()
            res.json({ response : userResult })
        }

        //total delivery captains
        let data1 = await serviceModel.find(
            {pickup_location:
                {$nearSphere:
                    {
                        $geometry: {type:"Point", coordinates:[pickup_longitude,pickup_latitude],
                        }
                    }
                }
        })
        if(data1.length === 0){
            res.json({ response : "0"})
        } else{
            let total_captains = data1.length;
            let updateData = { total_captains }

            let user =await new serviceModel(updateData)
            let userResult = user.save()
            res.json({ response : userResult })
        }
    }catch(error){
        responses.sendError(error.message, res)
    }
}
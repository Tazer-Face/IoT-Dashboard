const deviceModel = require('../models/Device');

exports.createDevice = async(req,res)=>{
    try{
        const {name,location,topic} = req.body;
        await deviceModel.insertOne(
            {
                name , location , topic
            }
        )
        res.status(201).send({success : true ,message : "New device is added successfully"});
    } catch(error){
        console.error("Error : "+ error);
        res.status(500).send({success : false ,message : "Device details already exist."});
    }
};

exports.updateDeviceDetails = async(req,res)=>{
    try{
        const {_id,name,location,topic} = req.body;
        await deviceModel.updateOne(
            {_id},
            { $set : {name,location,topic}}
        )
        res.status(200).send({success : true ,message : "The device details have been updated successfully"});
    } catch(error){
        res.status(500).send({success : false ,message : "Something went wrong"});
    } 
}

exports.deleteDeviceDetails = async(req,res)=>{
    try{
        let {_id} = req.body;
        await deviceModel.deleteOne({_id});
        res.status(200).send({success : true ,message : "The device has been removed successfully"});
    } catch(error){
        res.status(500).send({success : false ,message : "Something went wrong"});
    } 
}

exports.findAllDevices = async(req,res) => {
    try{
        let result = await deviceModel.find({}).lean();
        res.status(200).send(result);
    }
    catch(error){
        res.status(500).send("Something went wrong");
    }
}

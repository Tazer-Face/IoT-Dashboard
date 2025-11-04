const userModel = require('../models/User');

exports.login = async(req,res)=>{
    try{
        const {email,password} = req.body;
        const result = await userModel.findOne({email}).lean();
        if ( !result || password != result.password){
            res.status(500).send({success : false ,message : "Invalid credentials."});
        }
        res.status(201).send({
            success : true ,
            message : "Login successful.",
            name: result.name,
            role: result.role
        });
    } catch(error){
        res.status(500).send("Something went wrong"+"\n"+"Error : "+error);
    }
};

exports.createUser = async(req,res)=>{
    try{
        const {name,email,password} = req.body;
        console.log(name,email,password);
        await userModel.insertOne(
            {
                name , email , password
            }
        )
        res.status(201).send({success : true ,message : "New user is added successfully"});
    } catch(error){
        console.error("Error : "+ error);
        res.status(500).send({success : false ,message : "User credentials already exist."});
    }
};

exports.updateUserDetails = async(req,res)=>{
    try{
        let {name,email,role,devices} = req.body;
        await userModel.updateOne(
            {email},
            { $set : {name,role,devices}}
        )
        res.status(200).send({success : true ,message : "The user details have been updated successfully"});
    } catch(error){
        res.status(500).send({success : false ,message : "Something went wrong"});
    } 
}

exports.deleteUserDetails = async(req,res)=>{
    try{
        let {email} = req.body;
        await userModel.deleteOne({email});
        res.status(200).send({success : true ,message : "The user has been removed successfully"});
    } catch(error){
        res.status(500).send({success : false ,message : "Something went wrong"});
    } 
}

exports.findAllusers = async(req,res) => {
    try{
        let result = await userModel.find({}).populate('devices', 'name').lean();
        res.status(200).send(result);
    }
    catch(error){
        console.error("Error in findAllusers:", error);
        res.status(500).send("Something went wrong");
    }
}

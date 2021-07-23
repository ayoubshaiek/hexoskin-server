const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.get(`/`,async (req,res)=>{
    const userList = await User.find().select('-passwordHash');
    if(!userList){
        res.status(500).json({success:false});
    }
    res.send(userList);
});

router.get(`/:id`,async (req,res)=>{
    const user = await User.findById(req.params.id).select('-passwordHash');;
    if(!user){
        res.status(500).json({success:false})
    }
    res.status(200).send(user);

})
router.post(`/`, async(req,res)=>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password,10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartement: req.body.apartement,
        zip: req.body.zip,
        city: req.body.city,
        country:req.body.country,              
    })
    user= await user.save();
    if(!user)
        return res.status(400).send('the user cannot be created');
    
    res.send(user);
    // .then((createdUser=>{
    //     res.status(201).json(createdUser)
    // })).catch((err)=>{
    //     res.status(500).json({
    //         error:err,
    //         success:false
    //     })
    // })
    //res.send(product);
});

router.post(`/login`, async(req,res)=>{
    const secret = process.env.SECRET;
    const expire = process.env.EXPIRE;
    const user = await User.findOne({        
        email: req.body.email,
        //passwordHash: bcrypt.hashSync(req.body.passwordHash,10),      
    })
   
    if(!user){
        return res.status(400).send('user not found');
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token = jwt.sign(
                {        
                    userId : user.id,
                    isAdmin: user.isAdmin
                },
                secret,
                {
                    expiresIn : expire
                }
            )
        res.status(200).send({user : user.email , token : token});
    }
    else{
        res.status(400).send('password is wrong!');
    }
   // return res.status(400).send('password is wrong!');
    
});

router.post(`/register`, async(req,res)=>{
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password,10),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartement: req.body.apartement,
        zip: req.body.zip,
        city: req.body.city,
        country:req.body.country,              
    })
    user= await user.save();
    if(!user)
        return res.status(400).send('the user cannot be created');
    
    res.send(user);
    // .then((createdUser=>{
    //     res.status(201).json(createdUser)
    // })).catch((err)=>{
    //     res.status(500).json({
    //         error:err,
    //         success:false
    //     })
    // })
    //res.send(product);
});

router.get(`/get/count`,async (req,res)=>{
    const userCount = await User.countDocuments((count)=> count);
    if(!userCount){
        res.status(500).json({success:true , message:'the product'});
    } 
    res.send({userCount : userCount});
})

router.delete(`/:id`,(req,res)=>{
    if(mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid user Id')
    }
    User.findByIdAndRemove(req.params.id).then(user=>{
        if(user){
            return res.status(200).json({success:true , message:'the user is deleted'})
        } else{
            return res.status(404).json({success:false , message:'nothing is  deleted'})
        }
    }).catch(err=>{
        return res.status(500).json({success:false , error : err})
    })

})

module.exports = router;

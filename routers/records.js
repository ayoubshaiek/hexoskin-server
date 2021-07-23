const {Record} = require('../models/record');
const express = require('express');
const router = express.Router();

router.get(`/`,async (req,res)=>{
    const recordList = await Record.find();
    if(!recordList){
        res.status(500).json({success:false})
    }
    res.send(recordList);
})
router.get(`/:id`,async (req,res)=>{
    const record = await Record.findById(req.params.id);
    if(!record){
        res.status(500).json({success:false})
    }
    res.status(200).send(record);

})
router.post(`/`,(req,res)=>{
    const record = new Record({
        startDateSession: req.body.startDateSession,
        duree: req.body.duree ,  
        statut: req.body.statut    
    })
    record.save().then((createdRecord=>{
        res.status(201).json(createdRecord)
    })).catch((err)=>{
        res.status(500).json({
            error:err,
            success:false
        })
    })
    //res.send(product);
})

module.exports = router;
const {Product} = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg': 'jpg'
};

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');
        if(isValid){
            uploadError = null;
        }
        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
     // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
     //cb(null, file.fieldname + '-' + uniqueSuffix)
     const fileName = file.originalname.split(' ').join('-');
     const extension = FILE_TYPE_MAP[file.mimetype];
     cb(null, `${fileName}-${Date.now()}.${extension}` );
    }
  })
  
  var uploadOptions = multer({ storage: storage })
  

router.get(`/`,async (req,res)=>{
    //const productList = await Product.find().select('name image -_id');
    let filter = {};
    if(req.query.categories){
         filter = {category: req.query.categories.split(',')}
    }
    const productList = await Product.find(filter).populate('category'); 
    if(!productList){
        res.status(500).json({success:false})
    }
    res.send(productList);
})

router.get(`/:id`,async (req,res)=>{
    const product = await Product.findById(req.params.id);//.populate('category');
    if(!product){
        res.status(500).json({success:false})
    }
    res.send(product);
})

router.post(`/`,uploadOptions.single('image'), async(req,res)=>{
    const category = await Category.findById(req.body.category);
    if(!category){
        return res.status(400).send('Invalid Category');
    }
    const file = req.file;
    if(!file){
        return res.status(400).send('No image in the request');
    }
    const fileName = req.file.filename;
    const basePath =`${req.protocol}://${req.get('host')}/public/uploads/`;
    let product = new Product({  
        name:req.body.name, 
        description:req.body.description, 
        richDescription:req.body.richDescription, 
        image: `${basePath}${fileName}`, 
        images:req.body.images, 
        brand:req.body.brand, 
        price:req.body.price, 
        category:req.body.category, 
        countInStock:req.body.countInStock, 
        rating:req.body.rating, 
        numReviews:req.body.numReviews, 
        isFeatured:req.body.isFeatured, 
    })
    product = await product.save();
    if(!product){
        return res.status(500).send('the product cannot be created!')
    }
    res.send(product); 
   
    // product.save().then((createdProduct=>{
    //     res.status(201).json(createdProduct)
    // })).catch((err)=>{
    //     res.status(500).json({
    //         error:err,
    //         success:false
    //     })
    // })
    //res.send(product);
})

router.put(`/:id`,uploadOptions.single('image'),async (req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid Product Id');
    }
    const category = await Category.findById(req.body.category);
    if(!category){
        return res.status(400).send('Invalid Category');
    }

    const product = await Product.findById(req.params.id);
    if(!product){
        return res.status(400).send('Invalid Product');
    }

    const file = req.file;
    let imagepath;
    if(file){
        const fileName = file.filename;
        const basePath =`${req.protocol}://${req.get('host')}/public/uploads/`;
        imagepath = `${basePath}${fileName}`;
    }
    else{
        imagepath = product.image;
    }
    let updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,{
            name:req.body.name, 
            description:req.body.description, 
            richDescription:req.body.richDescription, 
            image:imagepath, 
            images:req.body.images, 
            brand:req.body.brand, 
            price:req.body.price, 
            category:req.body.category, 
            countInStock:req.body.countInStock, 
            rating:req.body.rating, 
            numReviews:req.body.numReviews, 
            isFeatured:req.body.isFeatured,
        },{
            new: true
        });
    if(!updatedProduct){
        res.status(500).send('the products cannot be updated');
    }
    res.status(200).send(updatedProduct);

})

router.delete(`/:id`,(req,res)=>{
    if(mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid Product Id')
    }
    Product.findByIdAndRemove(req.params.id).then(product=>{
        if(product){
            return res.status(200).json({success:true , message:'the product is deleted'})
        } else{
            return res.status(404).json({success:false , message:'nothing is  deleted'})
        }
    }).catch(err=>{
        return res.status(500).json({success:false , error : err})
    })

})

router.get(`/get/count`,async (req,res)=>{
    const productCount = await Product.countDocuments((count)=> count);
    if(!productCount){
        res.status(500).json({success:true , message:'the product'});
    } 
    res.send({productcount : productCount});
})
router.get(`/get/featured/:count`,async (req,res)=>{
    const count = req.params.count!=0 ? req.params.count : 1;
    const products = await Product.find({isFeatured: true}).limit(+count);
    if(!products){
        res.status(500).json({success:true , message:'the product'});
    } 
    res.send(products);
})

router.put(`/gallery-images/:id`,uploadOptions.array('images',10),async (req,res)=>{
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid Product Id');
    }
    const files = req.files;
    let imagesPaths = [];
    const basePath =`${req.protocol}://${req.get('host')}/public/uploads/`;

    if(files){
        files.map((file)=>{
            imagesPaths.push(`${basePath}${file.filename}`);
        })
    }    

    let product = await Product.findByIdAndUpdate(
        req.params.id,
        {            
            images:imagesPaths,          
        },
        {
            new: true
        });

    if(!product){
        return res.status(500).send('the gallery cannot be updated');
    }
    res.send(product);
})

module.exports = router;

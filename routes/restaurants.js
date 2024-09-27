const express = require('express');
const router = express.Router();
const Restaurant = require("../models/index");
const {check, validationResult} = require('express-validator'); 


router.post('/', [
    
    check('name').not().isEmpty().trim(),
    check('location').not().isEmpty().trim(),
    check('cuisine').not().isEmpty().trim(),
    // check('name').isLength({min: 1}).trim(),
    // check('location').isLength({min: 1}).trim(),
    // check('cuisine').isLength({min: 1}).trim(),
]
, async(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({error: errors.array()});//setting statuscode to 400 
        //if not it returns a 200 here.
    } else{
    await Restaurant.create(req.body);
    const allRestaurants = await Restaurant.findAll();
    res.json(allRestaurants);
    }
});



router.get('/', async (req,res)=>{
    const allRestaurants = await Restaurant.findAll();
    res.json(allRestaurants);
});

router.get('/:id', async(req,res)=>{
    const id = req.params.id;
    const foundRestaurant = await Restaurant.findByPk(id);
    res.json(foundRestaurant);
});


router.put('/:id', async(req,res)=>{
    try{
        const restaurantId = req.params.id;
        const {name, location, cuisine} = req.body;
        const foundRestaurant = await Restaurant.findByPk(restaurantId);
        if(!foundRestaurant){
            res.status(404).json({message: 'Restaurant not found'});
        }

        await foundRestaurant.update({name, location, cuisine});
        const allRestaurants = await Restaurant.findAll();
        res.json(allRestaurants);
        //can simplify code by writing
        // await foundRestauarant.update(req.body, {where: {id: req.params.id})
        //that means lines 34 and 35 can be removed.

    }catch (error){
        console.error(error);
        res.status(500).json({message: 'Error updating restaurant'});
    }
});


router.delete('/:id', async(req,res)=>{
    const deletedRestaurant = await Restaurant.destroy({where:{id: req.params.id}} );
    const allRestaurants = await Restaurant.findAll();
    res.json(allRestaurants);
});

module.exports = router;
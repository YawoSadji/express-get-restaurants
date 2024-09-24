const express = require("express");
const app = express();
const Restaurant = require("../models/index")
const db = require("../db/connection");
//TODO: Create your GET Request Route Below: 
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/restaurants', async (req,res)=>{
    const allRestaurants = await Restaurant.findAll();
    res.json(allRestaurants);
});

app.get('/restaurants/:id', async(req,res)=>{
    const id = req.params.id;
    const foundRestaurant = await Restaurant.findByPk(id);
    res.json(foundRestaurant);
});


app.post('/newRestaurant', async(req,res)=>{
    try{
    const {name, location, cuisine} = req.body;
    const newRestaurant = await Restaurant.create({name, location, cuisine});
    res.status(201).json(newRestaurant);
}catch (error){
    console.error(error);
    res.status(500).json({message: 'Error creating restaurant'});
}
});

app.put('/restaurants/:id', async(req,res)=>{
    try{
        const restaurantId = req.params.id;
        const {name, location, cuisine} = req.body;
        const foundRestaurant = await Restaurant.findByPk(restaurantId);
        if(!foundRestaurant){
            res.status(404).json({message: 'Restaurant not found'});
        }

        await foundRestaurant.update({name, location, cuisine});
        //can simplify code by writing
        // await foundRestauarant.update(req.body, {where: {id: req.params.id})
        //that means lines 34 and 35 can be removed.

    }catch (error){
        console.error(error);
        res.status(500).json({message: 'Error updating restaurant'});
    }
});


app.delete('/restaurants/:id', async(req,res)=>{
    const deletedRestaurant = await Restaurant.destroy({where:{id: req.params.id}} );
    res.json(deletedRestaurant);
});









module.exports = app;

const request = require('supertest');
const app = require('./src/app');
const Restaurant = require('./models');
const syncSeed = require('./seed');
let restauCount;
beforeEach(async()=>{
    await syncSeed();
    const allRestaurants = await Restaurant.findAll();
    restauCount = allRestaurants.length;
});
describe('restaurants tests', ()=>{

    test('GET /restaurants returns status code 200', async()=>{
        const response = await request(app).get('/restaurants');
        expect(response.statusCode).toBe(200);
    });
    test('GET /restaurants returns array of restaurants', async()=>{
        const response = await request(app).get('/restaurants');
        expect(response.body).toBeInstanceOf(Array);
    });
    test('GET /restaurants returns correct number of restaurants', async()=>{
        const response = await request(app).get('/restaurants');
        expect(response.body.length).toBe(restauCount);
    });
    test('GET /restaurants returns the correct restaurant data',async()=>{
        const response = await request(app).get('/restaurants');
        expect(response.body[0]).toEqual(expect.objectContaining({
            name: 'AppleBees',
            location: 'Texas',
            cuisine: 'FastFood'
          }));
    });

    test('GET /restaurants/:id returns the correct restaurant',async()=>{
        const response = await request(app).get('/restaurants/1');
        expect(response.body).toEqual(expect.objectContaining({
            id: 1,
            name: 'AppleBees',
            location: 'Texas',
            cuisine: 'FastFood'
          }));
    });

    test('POST /restaurants returns updated array with new value',async()=>{
        const response = 
        await request(app).post('/restaurants').send({
            name: 'CafeParis',
            location: 'Ohio',
            cuisine: 'French cuisine'
        });
        expect(response.body[(response.body.length) - 1]).toEqual(expect.objectContaining({
            name: 'CafeParis',
            location: 'Ohio',
            cuisine: 'French cuisine'
          }));
        expect(response.body.length).toEqual(restauCount + 1);
    });

    test('PUT /restaurants/:id updates array with provided value',async()=>{
        const response = 
        await request(app).put('/restaurants/2').send({
            location: 'Ohio',
        });
        const foundRestaurant = await Restaurant.findByPk(2);
        expect(response.body[1]).toEqual(expect.objectContaining({
            location: 'Ohio',
          }));
        expect(foundRestaurant.location).toBe('Ohio');
    });

    test('DELETE /restaurants/:id deletes restaurant with the provided id',async()=>{
        const response = 
        await request(app).delete('/restaurants/2');
        const foundRestaurant = await Restaurant.findByPk(2);
        expect(response.body.length).toBe(restauCount - 1);
        expect(foundRestaurant).toBeNull();
    });


});
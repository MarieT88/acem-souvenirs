//connecting db to server
const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_people_places_things');


//creating tables
const Person = conn.define('person', {
    name: {
        type: Sequelize.STRING
    }
});

const Place = conn.define('place', {
    name: {
        type: Sequelize.STRING
    }
});

const Thing = conn.define('thing', {
    name: {
        type: Sequelize.STRING
    }
});

const Souvenir = conn.define( 'souvenir', {
    
});

// joining tables
Souvenir.belongsTo(Person);
Souvenir.belongsTo(Place);
Souvenir.belongsTo(Thing);


// seeding data
const syncAndSeed = async() => {
    
    await conn.sync({force:true}); // must include this
    
    const [marie, vicky, des] = await Promise.all([
        Person.create({ name: 'marie'}), 
        Person.create({ name: 'vicky'}), 
        Person.create({ name: 'des'})
    ]);
    
    const [paris, fiji, nebraska] = await Promise.all([
        Place.create({ name: 'paris'}), 
        Place.create({ name: 'fiji'}), 
        Place.create({ name: 'nebraska'})
    ]);
    
    const [mug, magnet, boyfriend] = await Promise.all([
        Thing.create({ name: 'mug'}), 
        Thing.create({ name: 'magnet'}), 
        Thing.create({ name: 'boyfriend'})
    ]);
    
    const [] = await Promise.all([
        Souvenir.create({  personId: marie.id, placeId: paris.id, thingId: mug.id }),
        Souvenir.create({  personId: vicky.id, placeId: fiji.id, thingId: magnet.id }),
        Souvenir.create({  personId: des.id, placeId: nebraska.id, thingId: boyfriend.id })
    ]);
};

//export to server
module.exports = {
    conn,
    Person,
    Place,
    Thing,
    Souvenir,
    syncAndSeed
};












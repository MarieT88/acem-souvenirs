//connecting db to server
const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_people_places_things');


//creating tables
const Person = conn.define('person', {
    name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: true  //squelize feature that doesnt allow an empty string
        }
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
// Person.hasMany(Souvenir); will allow you to grab data from reverse


// seeding data
const syncAndSeed = async() => {
    
    await conn.sync({force:true}); // deletes and reseeds tables
    
    const [marie, vicky, des] = await Promise.all([
        Person.create({ name: 'marie'}), 
        Person.create({ name: 'vicky'}), 
        Person.create({ name: 'des'})
    ]);
    
    //how to add just one: Person.create({name: 'vinny'}); 
    
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
    
    await Promise.all([
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












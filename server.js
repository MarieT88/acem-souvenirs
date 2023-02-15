//server & requirements
const express = require('express');
const app = express();
const { conn, People, Place, Thing, Souvenir, syncAndSeed } = require('./db');

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(require('method-override')('_method'));

// post route
app.post('/', async(req, res, next) => {
    try{
       const souvenir = await Souvenir.create(req.body);
       res.redirect('/');
    }
    catch(ex) {
        next(ex);
    }
});

// delete route
app.delete('/', async(req, res, next) => {
    try{
       const souvenir = await Souvenir.findByPk(req.params.id);
       await souvenir.destroy();
       res.redirect('/');
    }
    catch(ex) {
        next(ex);
    }
});

//main route
app.get('/', async(req, res, next) => {
    try{
       const souvenirs = await Souvenir.findAll({
            include: [ People, Place, Thing ]
        }); 
        const peoples = await People.findAll();
        const places = await Place.findAll();
        const things = await Thing.findAll();

        res.send(`
            <html>
              <head>
                 <title>Acme People Places and Things</title>
              </head>
              <body>
                 <h1>Acme People, Places, and Things</h1>
                 <h2>People</h2>
                    <ul>
                     ${
                       peoples.map( person => {
                           return `
                               <li>
                                  ${ person.name } 
                               </li>
                            `;
                        }).join('')
                     }
                    </ul>
                  <h2>Places</h2>
                    <ul>
                     ${
                       places.map( place => {
                           return `
                               <li>
                                  ${ place.name } 
                               </li>
                            `;
                        }).join('')
                     }
                   </ul>
                  <h2>Things</h2>
                     <ul>
                      ${
                        things.map( thing => {
                           return `
                               <li>
                                  ${ thing.name } 
                               </li>
                            `;
                         }).join('')
                       }
                     </ul>
                   <h2>Souvenir Purchases</h2>
                     <ul>
                      ${
                        souvenirs.map( souvenir => {
                           return `
                               <li>
                                  ${ souvenir.person.name } purchased a ${ souvenir.thing.name } from ${ souvenir.place.name }
                               </li>
                            `;
                         }).join('')
                       }
                     </ul>
                   <form method='POST'>
                   <select name='personId'>
                     ${
                        peoples.map( person => {
                          return `
                            <option value=${person.id}>${ person.name }</option>
                           `;
                        }).join('')
                     }
                   </select>
                   <select name='placeId'>
                       ${
                          places.map( place => {
                            return `
                              <option value=${place.id}>${ place.name } </option> 
                            `;
                          }).join('')
                       }
                  </select>
                  <select name='thingId'>
                       ${
                           things.map( thing => {
                               return `
                                 <option value=${thing.id}>${ thing.name} </option>
                               `;
                           }).join('')
                       }
                   </select>
                   <button>Create</button>
                 </form>
                 <form method='POST' action='/${souvenirs.id}?_method=DELETE'>
                   <button> Delete </button>
                 </form>
               </body>
            </html>
        `);
        
    }
    catch(ex){
        next(ex);
    }
});

// error handling
app.use((err, req, res, next)=> {
  console.log(err);
  next(err);
});

// connect to port
const port = process.env.PORT || 3000;
app.listen(port, async()=> {
  try {
    await syncAndSeed();
    console.log(`listening on port ${port}`);
  }
  catch(ex){
    console.log(ex);
  }
});

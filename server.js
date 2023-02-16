//server & requirements
const express = require('express');
const app = express();
const db = require('./db');
const { conn, Person, Place, Thing, Souvenir, syncAndSeed } = db;

// middleware
app.use(express.urlencoded({ extended: false })); //need for put and post
app.use(require('method-override')('_method'));  // changes method so you can delete using html form

// post route
app.post('/', async(req, res, next) => {
    try{
       await Souvenir.create(req.body);
       res.redirect('/');
    }
    catch(ex) {
        next(ex);
    }
});

// delete route
app.delete('/:id', async (req, res, next) => {
 try {
   const souvenir = await Souvenir.findByPk(req.params.id);
   await souvenir.destroy();
   res.redirect('/');
 } catch (ex) {
   next(ex);
 }
});

//main route
app.get('/', async(req, res, next) => {
    try{
   const [people, places, things, souvenirs] = await Promise.all([
     Person.findAll(),
     Place.findAll(),
     Thing.findAll(),
     Souvenir.findAll({
       include: [Person, Place, Thing],
     }),
   ]);
   // const people = await Person.findAll();  *example of just one
  
 console.log(JSON.stringify(souvenirs, null, 2)); 
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
                       people.map( person => {
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
                     
                      <div>
                         <h2>Souvenir Purchases</h2>
                         <p>Create a new Souvenir Purchase by selecting a Person, the Place they purchased the souvenir, and the Thing they bought. </p>
                         <form method='POST'>
                         <label>Person</label>
                         <select name='personId'>
                                 ${people
                              .map((person) => {
                                     return `
                         <option value=${person.id}>
                               ${person.name}
                        </option>
                          `;
                        })
                          .join("")}
                    </select>
                   <label>Place</label>
                    <select name='placeId'>
                         ${places
                           .map((place) => {
                              return `
                             <option value=${place.id}>
                              ${place.name}
                              </option>
                            `;
                           })
                         .join("")}
                     </select>
                    <label>Thing</label>
                    <select name='thingId'>
                        ${things
                         .map((thing) => {
                            return `
                              <option value=${thing.id}>
                                 ${thing.name}
                              </option>
                          `;
                         })
                         .join("")}
                     </select>
                       <button>Create</button>
                      </form>
                     <ul>
                         ${souvenirs
                           .map((souvenir) => {
                           return `
                         <li>
                           ${souvenir.person.name} purchased a ${souvenir.thing.name} in ${souvenir.place.name}
                       <form method='POST' action='/${souvenir.id}?_method=DELETE'>
                       <button>
                           Delete
                        </button>
                      </form>
                       </li>
                       `;
                             })
                    .join("")}
                    </ul>
                 </div>
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
    //const souvenirs = await Souvenir.findAll({include: [ Person] }); //get souvenir data 
    //console.log(JSON.stringify(souvenirs, null, 2));  //view users in console
    console.log(`listening on port ${port}`);
  }
  catch(ex){
    console.log(ex);
  }
});

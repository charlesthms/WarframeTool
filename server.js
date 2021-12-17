const express = require('express');
const schedule = require('node-schedule');

const { get } = require('./public/routes/request');
const { getDetails } = require('./public/routes/details');
const { query } = require('./models/database/db_connect');
const { suggest } = require('./models/database/search');
const { dbUtils } = require('./models/database/data_fill');

const app = express();
const path = require('path');
const port = 8080;


app.use(express.static(__dirname + '/public'));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/views'));

app.post('/', async (req, resp) => {
    const suggestArray = await suggest(req.body.searchValue);

    //console.log(suggestArray.items);

    resp.json({
        suggestion: suggestArray
    });
});

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/template', function(req, res) {
    res.render('template');
});

app.get('/:var', async function(req, res) {

    const item = await query(`SELECT * FROM items WHERE item_name LIKE '${req.params.var}%'`);
    
    if(item.length > 0){

        get(req.params.var);

        //console.log(item);
        let itemsArray = [];
        for (let i = 0; i < item.length; i++) {
            itemsArray[i] = item[i];
        }
        
        const array = await getDetails(req.params.var);
        const comps = [];
        let details = [];

        for (let i = 0; i < array.length; i++) {

            if(i < array.length){
                if(!array[i].url_name.includes('set')){
                    comps.push(["/" + array[i].url_name, "https://warframe.market/static/assets/" + array[i].sub_icon, array[i].quantity_for_set]);
                }
            }
        
            if(array[i].url_name == req.params.var){
                details = array[i];
            }
            
        }
        //console.log(comps);

        data = {
            items: itemsArray,
            data: details,
            components: comps
        }
        //console.log(data.items);

        // Page à rendre avec en paramètre l'objet contenant les outputs de la query sql.
        res.render('template', data);


    } else {
        if(req.params.var != "favicon.ico") {
            console.log("Aucune donnée pour: " + req.params.var);
        }
        // Rediriger vers une page 404 ici
        res.render('notfound');
    }

});

app.listen(port, () => console.log("Serveur lancé sur http://website:8080"));

//dbUtils.getItems();

const job = schedule.scheduleJob('1 * * *', function(){
    dbUtils.getPrices();
});

module.exports = {
    app
}
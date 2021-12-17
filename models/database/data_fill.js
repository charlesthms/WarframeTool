const axios = require('axios');
const url = 'https://api.warframe.market/v1/items';

const fs = require('fs');

const { get } = require('../../public/routes/request');

const mysql = require('mysql2/promise');
const cfg = require('../config/login');

class dbUtils {

  static async getPrices() {
    const con = await mysql.createConnection(cfg);

    let result = await con.query(`SELECT id, item_name FROM items ORDER BY id ASC`);

    for (let i = 2500; i < 2642; i++) {
      try {

        const item_name = result[0][i].item_name;
        let prices = await get(item_name);

        if(!isNaN(prices[0])){
          await con.query(`UPDATE items SET med_price=${prices[0]}, min_price=${prices[1]}, max_price=${prices[2]}, last_update=CURRENT_TIME() WHERE item_name='${item_name}'`);
        } else {
          await con.query(`UPDATE items SET med_price=-1, min_price=-1, max_price=-1 WHERE item_name='${item_name}'`);
        }

        console.log(i + ' : ' + prices);

      } catch (err){
        console.log(err);
      }
    }

  }

  static async getItems() {
    await axios.get(url).then(async (response) => {
  
      const items = response.data.payload.items;
      console.log(items.length);
  
      let str = `INSERT INTO items (item_name, display_name) VALUES ?`;
      let values = [];
  
      let current = 0;
      
      for (let i = 0; i < 6; i++) {

        let limit = (current < 2500) ? current + 500 : items.length;

        for (let j = current; j < limit; j++) {

          let url_name = items[j].url_name;
          let display_name = items[j].item_name;

          values.push([url_name, display_name]);
        }
        current += 500;
        console.log(limit);
        
        if(values.length > 0){
          const con = await mysql.createConnection(cfg);
          con.query(str, [values]);
          values = [];
          con.end();
        }
      }
        
    }).catch(err => {
        console.log(err)
    });
  }
}



module.exports = {
  dbUtils
}

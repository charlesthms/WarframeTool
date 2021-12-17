const axios = require('axios');
const url = 'https://api.warframe.market/v1/items';

async function get(item) {

  let min = 100000;
  let max = 0;
  let sum = 0;
  let moy = -1;

  const response = await axios.get(url + '/'+ item +'/orders');
  const orders = response.data.payload.orders;
  
  let tot = 0;

  for (let i = 0; i < orders.length; i++) {

    if (orders[i].user.status == 'ingame' && orders[i].order_type != 'buy'){
      price = orders[i].platinum;

      if(price <= min) min = price;
      if(price >= max) max = price;
      
      sum += price;
      tot++;
    }

  }
  moy = Math.round(sum / tot);

  /* console.log('Prix moyen pour '+ item +': ' + moy +'pl');
  console.log(tot + ' offres analysées.');
  console.log("Min: " + min + " Max: " + max); */
  
  return [moy, min, max];
}

module.exports = {
  get
}

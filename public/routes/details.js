const axios = require('axios');
const url = 'https://api.warframe.market/v1/items/';

async function getDetails(item) {
    const response = await axios.get(url + item);

    //console.log(response.data.payload.item.items_in_set[0]);
    return response.data.payload.item.items_in_set;
}

module.exports = {
    getDetails
}
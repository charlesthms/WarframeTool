const { query } = require('./db_connect');

async function suggest(currentInput) {
    const suggestion = await query(`SELECT item_name, display_name FROM items WHERE display_name LIKE '${currentInput}%' LIMIT 5`);

    let suggestionArray = [];

    if (suggestion.length > 0){
        for (let i = 0; i < suggestion.length; i++) {
            suggestionArray[i] = suggestion[i];
        }
    };

    const data = {
        items: suggestionArray
    }

    //console.log(data);

    return data;
}

module.exports = {
    suggest
}

const searchBar = document.getElementById("search-bar");
const clearSearch = document.getElementById("clear-search");
const suggestion = document.getElementById("suggestion");

let searchBarValue;

// Event lorsque qq chose est tappé dans la barre de recherche
searchBar.addEventListener('keyup', async (e) => {
    $('#list').empty();
    searchBarValue = e.target.value;

    let data = {
        searchValue: e.target.value
    };

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    if (searchBarValue){
        // Requete
        const response = await fetch('/', options);
        const json = await response.json();

        const matchingSuggestion = json.suggestion.items;

        var ul = document.getElementById("list");
        
        for (let i = 0; i < matchingSuggestion.length; i++) {
            
            var li = document.createElement("li");
            var a = document.createElement("a");

            a.textContent = matchingSuggestion[i].display_name;
            a.href = '/' + matchingSuggestion[i].item_name;
            li.appendChild(a);
            ul.appendChild(li);
        }

        // Suppression du surplus
        clearSearch.style.display = 'unset';
        suggestion.style.visibility = 'unset';

        if(e.key === 'Enter'){
            window.location.href = '/' + e.target.value;
        }

    } if (e.key == 'Backspace' && !searchBarValue){
        clearSearch.style.display = 'none';
        suggestion.style.visibility = 'hidden';
        
        $('#list').empty();
    }
});

clearSearch.onclick = function () {
    if (searchBar.value){
        searchBar.value = '';
        clearSearch.style.display = 'none';
        suggestion.style.visibility = 'hidden';
    }
}
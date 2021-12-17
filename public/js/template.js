const options = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
};

const response = fetch('/');
const json = response.json();

console.log(json);
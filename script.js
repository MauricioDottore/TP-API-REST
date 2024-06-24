// script.js

document.getElementById('getAllPokemon').addEventListener('click', () => {
    getAllPokemon();
});

document.getElementById('filterForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    const type = document.getElementById('type').value;

    getAllPokemon(height, weight, type);
});

function getAllPokemon(heightFilter = null, weightFilter = null, typeFilter = null) {
    let url = 'https://pokeapi.co/api/v2/pokemon?limit=100';
    fetchAllPages(url)
        .then(data => filterAndDisplayPokemon(data, heightFilter, weightFilter, typeFilter))
        .catch(error => showError(error));
}

async function fetchAllPages(url) {
    let allPokemon = [];
    let response = await fetch(url);
    let data = await response.json();
    allPokemon = allPokemon.concat(data.results);

    while (data.next) {
        response = await fetch(data.next);
        data = await response.json();
        allPokemon = allPokemon.concat(data.results);
    }

    return allPokemon;
}

function filterAndDisplayPokemon(pokemonList, heightFilter, weightFilter, typeFilter) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    pokemonList.forEach(pokemon => {
        fetch(pokemon.url)
            .then(response => response.json())
            .then(data => {
                if ((heightFilter && data.height != heightFilter) ||
                    (weightFilter && data.weight != weightFilter) ||
                    (typeFilter && !data.types.some(t => t.type.name === typeFilter.toLowerCase()))) {
                    return;
                }

                const pokemonDiv = document.createElement('div');
                pokemonDiv.className = 'pokemon';
                pokemonDiv.innerHTML = `
                    <img src="${data.sprites.front_default}" alt="${data.name}" width="150" height="150">
                    <div>
                        <h3>${data.name}</h3>
                        <p>Height: ${data.height}</p>
                        <p>Weight: ${data.weight}</p>
                        <p>Type: ${data.types.map(type => type.type.name).join(', ')}</p>
                    </div>
                `;
                resultsDiv.appendChild(pokemonDiv);
            })
            .catch(error => showError(error));
    });
}

function showError(error) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
}

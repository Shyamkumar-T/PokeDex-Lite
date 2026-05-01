// Define variables
let limit = 20;
let offset = 0;
let currentType = "all";
let searchQuery = "";
let currentPagePokemon = [];
const container = document.getElementById("pokemon-container");
const select = document.querySelector(".search-select");
const searchInput = document.querySelector(".search-inp");
const searchIcon = document.querySelector(".search-icon-bg");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
// Fecth image
function getImage(pokemon) {
    return (
        pokemon.sprites.front_default ||
        pokemon.sprites.other?.["official-artwork"]?.front_default ||""
    );
}
// Fetch pokemon types
function getPokemonTypeText(pokemon) {
    return pokemon.types.map(typeItem => typeItem.type.name).join(", ");
}
// fecth and modify the inner cards(rendering)
function renderPokemons() {
    if (!container){
        return;
    }
    const filteredPokemons = currentPagePokemon.filter(pokemon => {
        const typeText = getPokemonTypeText(pokemon);
        const matchesType =
            currentType === "all" || typeText.includes(currentType);
        const matchesSearch =
            !searchQuery || pokemon.name.toLowerCase().includes(searchQuery);
        return matchesType && matchesSearch;
    });
    if (filteredPokemons.length === 0) {
        container.innerHTML = `<p class="empty-message">No Pokémon found.</p>`;
        return;
    }
    container.innerHTML = filteredPokemons
        .map(pokemon => {
            const image = getImage(pokemon);
            const typeText = getPokemonTypeText(pokemon);
            return `
                <div class="card"
                    data-name="${pokemon.name}"
                    data-image="${image}"
                    data-height="${pokemon.height} dm"
                    data-weight="${pokemon.weight} hg"
                    data-type="${typeText}">                
                    <div class="add-fav">
                        <p>Add favourites</p>
                    </div>
                    <img src="${image}" alt="${pokemon.name}">
                    <h2>${pokemon.name.toUpperCase()}</h2>
                    <p>Height : ${pokemon.height} dm</p>
                    <p>Weight : ${pokemon.weight} hg</p>
                    <p>Type : ${typeText}</p>
                </div>
            `;
        })
        .join("");
}
async function getPokemons() {
    if (!container) return;
    try {
        container.innerHTML = `<p class="loading-message">Loading...</p>`;
        const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
        const response = await fetch(url);
        const data = await response.json();
        currentPagePokemon = await Promise.all(
            data.results.map(async pokemon => {
                const pokemonResponse = await fetch(pokemon.url);
                return await pokemonResponse.json();
            })
        );
        renderPokemons();
    } catch (error) {
        console.error(error);
        container.innerHTML = `<p class="empty-message">Something went wrong.</p>`;
    }
}
//render accoridng to inputs
if (select) {
    select.addEventListener("change", () => {
        currentType = select.value;
        offset = 0;
        getPokemons();
    });
}
if (searchInput) {
    searchInput.addEventListener("input", () => {
        searchQuery = searchInput.value.trim().toLowerCase();
        renderPokemons();
    });
}
if (searchIcon) {
    searchIcon.addEventListener("click", () => {
        searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : "";
        renderPokemons();
    });
}
if (container) {
    container.addEventListener("click", (e) => {
        const favBtn = e.target.closest(".add-fav");
        if (!favBtn) return;
        const card = favBtn.closest(".card");
        if (!card) return;
        const pokemon = {
            name: card.dataset.name,
            image: card.dataset.image,
            height: card.dataset.height,
            weight: card.dataset.weight,
            type: card.dataset.type
        };
        let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
        const alreadyExists = favourites.some(fav => fav.name === pokemon.name);
        if (!alreadyExists) {
            favourites.push(pokemon);
            localStorage.setItem("favourites", JSON.stringify(favourites));
            alert(`${pokemon.name} added to favourites`);
        } else {
            alert("Pokemon already added");
        }
    });
}
//Seamless and ideal functions for prev and next button
if (prevBtn) {
    prevBtn.addEventListener("click", () => {
        if (offset >= limit) {
            offset -= limit;
            getPokemons();
        }
    });
}

if (nextBtn) {
    nextBtn.addEventListener("click", () => {
        offset += limit;
        getPokemons();
    });
}
getPokemons();
// Define variables
const favContainer = document.querySelector(".fav-container");
// fetch the favourute cards and display
function displayFavorites(){
    let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
    if(favourites.length === 0){
        favContainer.innerHTML = "<p class='empty'>No favourites added yet.</p>";
        return;
    }
    favContainer.innerHTML = "";
    favourites.forEach((pokemon,index) => {
        let card = document.createElement("div");
        card.classList.add("pokemon-card");
        card.innerHTML = `
            <button class="remove-btn" data-index="${index}">
                Remove favourite
            </button>
            <img src="${pokemon.image}" alt="${pokemon.name}">
            <h2>${pokemon.name.toUpperCase()}</h2>
            <p>${pokemon.height}</p>
            <p>${pokemon.weight}</p>
            <p>${pokemon.type}</p>
        `;
        favContainer.appendChild(card);
    });
    removeFavourite();
}
// Remove upon clicking remove btn
function removeFavourite(){
    let removeButtons = document.querySelectorAll(".remove-btn");
    removeButtons.forEach((button) => {
        button.addEventListener("click",() => {
            let favourites =
            JSON.parse(localStorage.getItem("favourites")) || [];
            let index = button.dataset.index;
            favourites.splice(index,1);
            localStorage.setItem(
                "favourites",
                JSON.stringify(favourites)
            );
            displayFavorites();
        });
    });
}
displayFavorites();
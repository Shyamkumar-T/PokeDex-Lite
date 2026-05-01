//Define variables 
let home = document.querySelector(".home-nav");
let allPokemons = document.querySelector(".all-pokemons-nav");
let fav = document.querySelector(".favourites-nav");
let about = document.querySelector(".about-nav");
let present = home;
const url = "https://pokefacts.vercel.app/?count=200";
let closeP = document.querySelector(".close-p");
let facts = document.querySelector(".facts");
let i =-1;
let cv = document.querySelector(".cover-letter1");
//Fetch url and facts
const getFacts = async (i)=>{
    console.log("fetching data...");
    facts.innerText="Loading..."
    let response = await fetch(url);
    console.log(response);
    let data = await response.json();
    let fact = data.data[i];
    console.log(fact);
    facts.innerText = fact;
    cv.src="Open Surprise.png";
}
//Initiate facts
cv.addEventListener("click",()=>{
    i++;
    getFacts(i);//Update facts
});
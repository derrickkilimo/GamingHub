import API_KEY from './config.js';
// import dotenv from 'dotenv';
// dotenv.config();
// import 'dotenv/config';

const searchInput = document.querySelector(".search-games");
const searchButton = document.querySelector(".search-button");
console.log("Here")
const gameList = document.getElementById("gameNewContainer");

// Create a .env file and store your key in API_KEY variable


const url = `https://api.rawg.io/api/games?key=${API_KEY}&dates=2009-01-01,2023-08-01&ordering=-added`


// get platforms of all games

const getPlatformStr = (platforms) =>{

    console.log("before loop")
    const platformStr = platforms.map(pl => pl.platform.name).join(", ");
    console.log(platformStr,"Here")
    if (platformStr.length > 30) {
        return platformStr.substring(0, 30) + "...";
    }
    return platformStr

  }
  //search input

  function searchGames() {
  const searchTerm = searchInput.value.trim(); // Get the search term from the input field
  if (searchTerm) {
    const gameItems = document.querySelectorAll(".item"); // Get all the game items
    gameItems.forEach((item) => {
      const gameName = item.querySelector(".game-name").innerText.toLowerCase(); // Get the game name and convert to lowercase for case-insensitive search
      if (gameName.includes(searchTerm.toLowerCase())) {
        // Check if the game name includes the search term
        item.style.display = "block"; // Show the game item if it matches the search
      } else {
        item.style.display = "none"; // Hide the game item if it does not match the search
      }
    });
  } else {
    // If the search term is empty, show all the game items
    const gameItems = document.querySelectorAll(".item");
    gameItems.forEach((item) => {
      item.style.display = "block";
    });
  }
}

// Event listener for the search button
searchButton.addEventListener("click", searchGames);







// fetch games from RAWG.io game database

async function fetchData() {
    try {
        
      await fetch(url).then(response => response.json()).then(data => {
        console.log("data")
        nextGameListUrl = data.next ? data.next : null;
        const games = data.results;
        console.log(games)
        const gameContainer = document.getElementById("gameNewContainer");
        gameContainer.classList.add("myGameContainer")

        games.forEach((game) => {
            const gameItemEl = createGameItemElement(game);
            gameContainer.appendChild(gameItemEl);
          });
      
          if (nextGameListUrl) {
            loadMoreGamesBtn.classList.remove("hidden");
          } else {
            loadMoreGamesBtn.classList.add("hidden");
          }
        if (nextGameListUrl) {
            loadMoreGamesBtn.classList.remove("hidden");
        } else {
            loadMoreGamesBtn.classList.add("hidden");
        }
    })
    }
    catch (error) {
      console.log("An error occurred here:", error);
    }
  
}

// creates elements to loop all the games in a game card

function createGameItemElement(game){
    const gameItemEl = document.createElement("div");
    gameItemEl.classList.add("col-lg-1", "col-md-1", "col-sm-2", "item");
    const imageEl = document.createElement("img");
    imageEl.src = game.background_image;
    imageEl.alt = `${game.name} image`;
    imageEl.classList.add("img-fluid"); // Bootstrap class to make the image responsive
    
    const gameNameEl = document.createElement("h4");
    gameNameEl.classList.add("game-name");
    gameNameEl.innerHTML = `${game.name}<br><span class="platforms">${getPlatformStr(game.parent_platforms)}</span>`;
    
    const ratingEl = document.createElement("div");
    ratingEl.classList.add("rating");
    // Use Bootstrap classes for styling the rating element
    ratingEl.innerHTML = `<i class="fa fa-star"></i> <span class="badge bg-primary">${game.rating}</span>`;
    
    const dateEl = document.createElement("div");
    dateEl.classList.add("date");
    // Use Bootstrap classes for styling the date element
    dateEl.innerHTML = `<i class="fa-regular fa-calendar"></i> <span class="badge bg-secondary">${game.released}</span>`;
    
    const gameInfoEl = document.createElement("div");
    gameInfoEl.classList.add("game-info");
    // Use Bootstrap classes for the layout of game info elements
    gameInfoEl.classList.add("d-flex", "justify-content-between", "align-items-center", "mt-2");
    gameInfoEl.appendChild(ratingEl);
    gameInfoEl.appendChild(dateEl);
    
    const gameWrapperEl = document.createElement("div");
    // Use Bootstrap classes for the item wrapper
    gameWrapperEl.classList.add("p-3");
    gameWrapperEl.appendChild(imageEl);
    gameWrapperEl.appendChild(gameNameEl);
    gameWrapperEl.appendChild(gameInfoEl);
    
    gameItemEl.appendChild(gameWrapperEl);
    
    return gameItemEl;
  }

// load games

function loadGames(){
  fetchData()
}

loadGames();

//load more games in the list of already populated

const loadMoreGamesBtn = document.getElementById("loadMoreGamesBtn");
let nextGameListUrl = null;

async function loadMoreGames() {
  try {
    if (nextGameListUrl) {
      const response = await fetch(nextGameListUrl);
      const data = await response.json();
      const games = data.results;
      const gameContainer = document.getElementById("gameNewContainer");

      games.forEach((game) => {
        const gameItemEl = createGameItemElement(game);
        gameContainer.appendChild(gameItemEl);
      });

      nextGameListUrl = data.next ? data.next : null;

      if (!nextGameListUrl) {
        loadMoreGamesBtn.classList.add("hidden");
      }
    }
  } catch (error) {
    console.log("An error occurred:", error);
  }
}

loadMoreGamesBtn.addEventListener("click", loadMoreGames);

// authenticate user

async function loginUser() {
  const username = document.querySelector('.user').value;
  const password = document.querySelector('.pass').value;

  const response = await fetch('/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: username, password: password }),
  });

  const data = await response.json();

  if (response.ok) {
    // If login is successful, show the homepage
    showHomePage();
  } else {
    // If login fails, show an error message
    console.log('Login failed: ', data.message);
  }
}

// Event listener for the login button
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent the default form submission behavior
  loginUser();
});

// ... Other code ...

function showHomePage() {
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('home-wrapper').style.display = 'block';
}

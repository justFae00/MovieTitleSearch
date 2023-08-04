const searchBox = document.getElementById("search-box");
const movieContainer = document.getElementsByClassName("movies-container");
const noResultMessage = document.getElementById("no-result");
const loading = document.getElementById("loading");

const resultNumber = 10; //this API provides limited result of 10

searchBox.addEventListener("keypress", function (event) {
  if (event.key === "Enter" && searchBox.value != "") {
    deleteElements(); //clean up
    noResultMessage.innerHTML = "";
    loading.style.display = "block"; //show display until API is fetched
    getAPI();
  }
});

const apiURL = "https://www.omdbapi.com/?";
const apiKey = "29181d8e";

let movieTitle = "";
let releaseYear = "";
let resultType = "";
let IMDBid = "";
let searchTitle = "";

async function getAPI() {
  searchTitle = searchBox.value;

  const response = await fetch(
    apiURL +
      `&apikey=${apiKey}` +
      `&t=${movieTitle}` +
      `&y=${releaseYear}` +
      `&type=${resultType}` +
      `&i=${IMDBid}` +
      `&s=${searchTitle}`
  );
  let data = await response.json();

  loading.style.display = "none";

  //check if the request produces a result at all
  if (data.Response === "False") {
    noResultMessage.innerHTML = "No result found for " + searchTitle + " :(";
  } else {
    for (let index = 0; index < resultNumber; index++) {
      addNewElement(data.Search[index], index);
    }
  }
}

async function addNewElement(data, index) {
  const IMDBid = data.imdbID;

  //since searching with "s" parameter doesn't provied details,
  //we must fetch the extra data using movie's unique IMDB ID
  const response = await fetch(apiURL + `&apikey=${apiKey}` + `&i=${IMDBid}`);
  let extraData = await response.json();

  //hierarchy: movieContainer > newMovie > movieName & movieImg & description
  //description > movieGenre & movieDirector & moviePlot & movieRating

  const newMovie = document.createElement("div");
  let name = "movie" + (index + 1);
  newMovie.id = name;
  newMovie.className = "item";

  const movieLink = document.createElement("a");
  let link = "https://www.imdb.com/title/" + IMDBid;
  movieLink.href = link;
  movieLink.target = "_blank";
  newMovie.appendChild(movieLink);

  const newPoster = document.createElement("img");
  newPoster.src = data.Poster;
  newPoster.className = "movie-img";
  newPoster.alt = data.Title + " (" + data.Year + ")";
  movieLink.appendChild(newPoster);

  const movieName = document.createElement("p");
  movieName.className = "movie-name";
  movieName.innerHTML = data.Title + " (" + data.Year + ")";
  newMovie.appendChild(movieName);

  const description = document.createElement("div");
  description.className = "description";

  const movieGenre = document.createElement("p");
  movieGenre.className = "movie-genre";
  movieGenre.innerHTML = "Genres: " + extraData.Genre;
  description.appendChild(movieGenre);

  const movieDirector = document.createElement("p");
  movieDirector.className = "movie-director";
  movieDirector.innerHTML = "Director: " + extraData.Director;
  description.appendChild(movieDirector);

  const moviePlot = document.createElement("p");
  moviePlot.className = "movie-plot";
  moviePlot.innerHTML = "Plot: " + extraData.Plot;
  description.appendChild(moviePlot);

  if (extraData.Ratings.length > 1) {
    const rottenRating = document.createElement("p");
    rottenRating.className = "rotten-tomato-rating";
    rottenRating.innerHTML = "🍅Rotten Tomato: " + extraData.Ratings[1].Value;
    description.appendChild(rottenRating);
  }

  newMovie.appendChild(description);
  movieContainer[0].appendChild(newMovie);
}

//delete all new elements
function deleteElements() {
  for (let index = 0; index < resultNumber; index++) {
    let name = "movie" + (index + 1);
    const temp = document.getElementById(name);
    if (temp) {
      temp.remove();
    }
  }
}

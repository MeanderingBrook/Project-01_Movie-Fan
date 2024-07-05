// Assigns Constants to hold User Input values until added to permanent Array (Local Storage)
const inputMovie = document.getElementById("movie-name");

function refreshMovieHistory() {
  // Loads existing Location Searches from Local Storage to permanent Array (searchMovieHistory), else: empty Array
  let searchMovieHistory = localStorage.getItem("movieSearch")
    ? JSON.parse(localStorage.getItem("movieSearch"))
    : [];
  // console.log(searchMovieHistory);

  // Returns current Search History for use by other Functions
  return searchMovieHistory;
}

function getUserMovie() {
  // Calls Search History and assigns Local Storage Object to local Variable
  searchMovieHistory = refreshMovieHistory();

  // Assigns Temporary Object in which to hold User Input Location prior to adding to Local Storage (movieSearch)
  newSearch = {};
  // console.log(newSearch);

  // Assigns User-selected Movie >>
  //
  // Note to Reviewers: Test Code used to validate functionality without the need to continually input Movie data - NO LONGER USED
  // let inputMovie = "Transformers";

  newSearch.movieName = inputMovie.value;
  console.log(`The new Movie entered is, ${newSearch.movieName}`);

  // newSearch.cntryLoc = inputCntryCode;
  // console.log(`The Country Code is, ${newSearch.cntryLoc}`);

  // Defines Movie Name variable to be passed to IMDb API
  searchMovie = newSearch.movieName;
  console.log(`The Input Movie is, ${searchMovie}`);
  //
  // << Assigns User-selected Movie

  // Determines if current, User-input Movie is already present in searchMovieHistory (Boolean Value)
  let moviePresent = searchMovieHistory.some(function (el) {
    return el.movieName === newSearch.movieName;
  });

  // Checks for required User-input Movie, and if Movie was previously searched
  if (newSearch.movieName) {
    // Determines if searchMovieHistory Object is empty OR if current User-input Movie is NOT present in searchMovieHistory
    if (!Object.entries(searchMovieHistory.length) || moviePresent === false) {
      // Adds new Search inputs to searchMovieHistory ONLY if searchMovieHistory is empty, OR if current Movie is NOT present in searchMovieHistory
      searchMovieHistory.push(newSearch);

      // Adds values of searchMovieHistory to Local Storage
      localStorage.setItem("movieSearch", JSON.stringify(searchMovieHistory));

      // Calls IMDb API, then Display Function
      getIMDd().then(displayMovie);
    } else {
      // If Search Movie IS present in searchMovieHistory, only calls IMDb API
      getIMDd().then(displayMovie);
    }
  } else {
    // Alert if User has failed to enter Movie name
    alert("Please enter a Movie name.");
  }
}

async function getIMDd() {
  // API Information: https://rapidapi.com/rahilkhan224/api/imdb-movies-web-series-etc-search

  // userInput = "Phantom Menace"; // JUST COMMENTED THIS OUT
  // title = userInput.replace(/\s+/g, "-").toLowerCase();
  title = searchMovie.replace(/\s+/g, "-").toLowerCase();
  // title = "Phantom-Menace";

  const url =
    // "https://imdb-movies-web-series-etc-search.p.rapidapi.com/titanic.json";
    `https://imdb-movies-web-series-etc-search.p.rapidapi.com/${title}.json`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "f2c7db1021msh8898dbff1cee81cp1ee241jsncc76f48ace1c",
      "x-rapidapi-host": "imdb-movies-web-series-etc-search.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    // const result = await response.text();
    const result = await response.json();

    // Console Log Output - Testing Purposes
    console.log(result);
    consoleResult(result);

    // Calls Display function, rendering returned Weather data
    displayMovie(result);
  } catch (error) {
    console.error(error);
  }
}

// Displays IMDb 'result' through dynamically created HTML Elements
function displayMovie(result) {
  // Assigns Target HTML Element to which to Append Current Movie Name
  const currentMovie = $("#current-movie");

  // Assign Target HTML Element to which to Append Current Movie Poster
  const moviePoster = $("movie-poster");

  // Assigns Target HTML Element to which to Append Movie Details
  const movieDetails = $("#movie-details");

  // Clears Display of prior Weather Data
  function clearDisplay() {
    $("#movie-name").remove();
    $("#movie-year").remove();
    $("#poster-id").remove();
    $("#movie-details").children().remove();
  }
  clearDisplay();

  // Displays Movie Name, Movie Year >>
  //
  // Creates Current Movie Name Element (<h2>)
  const movieName = $("<h2>").attr("id", "movie-name");
  movieName.text(result.d[0].l + " ");

  // Creates Movie Year Element (<h2>)
  const movieYear = $("<h2>").attr("id", "movie-year");
  movieYear.text(result.d[0].id);

  // Appends Move Name, and Movie Year to Current Movie <div>
  currentMovie.append(movieName, movieYear);
  //
  // << Displays Movie Name, Movie Year

  // Displays Movie Poster Image >>
  //
  // Assigns Movie Poster URL returned from IMDb API
  const posterURL = result.d[0].imageURL;

  // Creates Movie Poster Container (<div>)
  const posterContainer = $("<div>")
    .addClass("poster-container")
    .attr("id", "poster-id");

  // Assigns IMDb Poster URL to Image Tag (<img>)
  const posterImg = $("<img>").attr("src", posterURL);

  // Appends Poster Image to Poster Container
  posterContainer.append(posterImg);

  moviePoster.append(posterContainer);
  //
  // << Displays Movie Poster Image

  // Displays Movie Details >>
  //
  // Creates Movie Details Container (<div>)
  const movieDetailsContainer = $("<div>")
    .addClass("movie-details-card")
    .attr("id", "movie-details-id");

  // Displays Actors Data in HTML >>
  const detailsActorsCard = $("<div>")
    .addClass("flex-row")
    .attr("id", "movie-actors-id");
  const detailsActorsHeader = $("<h5>").text("Actors:");
  // Assigns Temperature (Farenheit) and adds Degree Symbol
  const detailsActors = $("<p>").text(result.d[0].q); // FIX THIS DATA REFERENCE !!!

  detailsActorsCard.append(detailsActorsHeader, detailsActors);
  movieDetailsContainer.append(detailsActorsCard);
  // << Displays Actors Data in HTML

  // Appends Movie Details Container to static Movie Details HTML Element
  movieDetails.append(movieDetailsContainer);
  //
  // << Displays Movie Details

  // Clears User-input City value in Search field to ready for next User search
  $("#movie-name").val("");

  // Calls function to display past Movie searches (sidebard)
  // displaySearchHistory();  // UPDATE !!!
}

function consoleResult(result) {
  console.log(result.d[0].id);
  console.log(result.d[0].l);
}

// Assigns Constants to hold User Input values until added to permanent Array (Local Storage)
const inputMovie = document.getElementById("movie-search");

function refreshMovieHistory() {
  // Loads existing Location Searches from Local Storage to permanent Array (searchMovieHistory), else: empty Array
  let searchMovieHistory = localStorage.getItem("movieSearch")
    ? JSON.parse(localStorage.getItem("movieSearch"))
    : [];
  // console.log(searchMovieHistory);

  // Returns current Search History for use by other Functions
  return searchMovieHistory;
}

function updateMovieData() {
  let movieAPIData = localStorage.getItem("movieData")
    ? JSON.parse(localStorage.getItem("movieData"))
    : [];

  return movieAPIData;
}

// Captures User Movie Input, Stores to Local Storage (if new), and Passes Movie as Variable to API Function (getIMDd())
function getUserMovie() {
  // Calls Search History and assigns Local Storage Object to local Variable
  searchMovieHistory = refreshMovieHistory();

  // Assigns Temporary Object in which to hold User Input Location prior to adding to Local Storage (movieSearch)
  newSearch = {};
  // console.log(newSearch);

  // Assigns User-selected Movie >>
  //
  // Test Code used to validate functionality without the need to continually input Movie Name data through User Form - NO LONGER USED
  // let inputMovie = "Transformers";

  // Assigns User Input 'Movie Name' to Temporary Object element
  newSearch.movieName = inputMovie.value;
  // console.log(`The new Movie entered is, ${newSearch.movieName}`);

  // Defines Movie Name variable to be passed to IMDb API
  searchMovie = newSearch.movieName;
  // console.log(`The Input Movie is, ${searchMovie}`);
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
      // getIMDd().then(displayMovie);  // DEPRECATED DELETE !!!
      getIMDd();
    } else {
      // If Search Movie IS present in searchMovieHistory, only calls IMDb API
      // getIMDd().then(displayMovie); // DEPRECATED DELETE !!!
      getIMDd();
    }
  } else {
    // Alert if User has failed to enter Movie name
    alert("Please enter a Movie name.");
  }
}

// Calls (Third-Party) IMDd API for Movie Information
async function getIMDd() {
  // API Information: https://rapidapi.com/rahilkhan224/api/imdb-movies-web-series-etc-search

  // Test Code used to validate functionality without the need to continually input Movie Name data through User Form - NO LONGER USED
  // movieTitle = "Phantom-Menace";
  movieTitle = searchMovie.replace(/\s+/g, "-").toLowerCase();

  const url = `https://imdb-movies-web-series-etc-search.p.rapidapi.com/${movieTitle}.json`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "f2c7db1021msh8898dbff1cee81cp1ee241jsncc76f48ace1c",
      "x-rapidapi-host": "imdb-movies-web-series-etc-search.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    // const result = await response.text();  // DEPRECATED FOR JSON DELETE !!!
    const result = await response.json();

    // Test Code used to output (Third-Party) IMDd API values to Console - NO LONGER USED
    // console.log(result);
    // consoleIMDbResult(result);

    // Assigns IMDd Movie ID Code to variable to be passed to Streaming Services API (which requires IMDb Movie ID for search)
    let movieID = result.d[0].id;

    // Calls Streaming Services API to search for User-selected Movie
    getStreamingServices(movieID);

    // Calls Display function, rendering returned Movie data
    displayMovie(result);
  } catch (error) {
    console.error(error);
  }
}

async function getStreamingServices(movieID) {
  // API Reference: https://docs.movieofthenight.com/guide/shows

  // Test Code used to validate functionality without the need to continually input Movie Name data through User Form - NO LONGER USED
  // movieID = "tt0068646";

  const url = `https://streaming-availability.p.rapidapi.com/shows/${movieID}?country=us`;
  // "https://streaming-availability.p.rapidapi.com/shows/movie/tt0068646";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "f2c7db1021msh8898dbff1cee81cp1ee241jsncc76f48ace1c",
      "x-rapidapi-host": "streaming-availability.p.rapidapi.com",
      // "--data-urlencode": "country='us'",
    },
  };

  try {
    const response = await fetch(url, options);
    // const result = await response.text();
    const result = await response.json({});

    // console.log(result);
    consoleStreamingResult(result);
  } catch (error) {
    console.error(error);
  }
}

// Displays IMDb API 'result' through dynamically created HTML Elements
function displayMovie(result) {
  // Assigns Target HTML Element to which to Append Current Movie Name
  // const currentMovie = $("#current-movie");
  const movieSummary = $("#movie-summary");

  // Assigns Target HTML Element to which to Append Movie Details
  const movieDetails = $("#movie-details");

  // Assign Target HTML Element to which to Append Current Movie Poster
  const moviePoster = $("#movie-poster");

  // Clears Display of prior Movie Data
  function clearDisplay() {
    $("#movie-summary").children().remove();
    $("#movie-details").children().remove();
    $("#movie-poster").children().remove();
  }
  clearDisplay();

  // Displays Movie Name, Movie Year >>
  //
  // Creates Current Movie Name Element (<h2>)
  const movieName = $("<h2>").attr("id", "movie-name");
  movieName.text(result.d[0].l);
  // console.log(result.d[0].l);

  // Creates Movie Year Element (<h2>)
  const movieYear = $("<h2>").attr("id", "movie-year");
  movieYear.text(`(${result.d[0].y})`);
  // console.log(result.d[0].y);

  // Appends Move Name, and Movie Year to Current Movie <div>
  movieSummary.append(movieName, movieYear);
  //
  // << Displays Movie Name, Movie Year

  // Displays Movie Poster Image >>
  //
  // Assigns Movie Poster URL returned from IMDb API
  // console.log(result.d[0].i.imageUrl);
  const posterURL = result.d[0].i.imageUrl;

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
  // Assigns Actors information
  // console.log(result.d[0].s);
  const detailsActors = $("<p>").text(result.d[0].s);

  detailsActorsCard.append(detailsActorsHeader, detailsActors);
  movieDetailsContainer.append(detailsActorsCard);
  // << Displays Actors Data in HTML

  // Appends Movie Details Container to static Movie Details HTML Element
  movieDetails.append(movieDetailsContainer);
  //
  // << Displays Movie Details

  // Clears User-input City value in Search field to ready for next User search
  $("#movie-search").val("");

  // Calls function to display past Movie searches (sidebard)
  // displaySearchHistory();  // UPDATE !!!
}

function consoleIMDbResult(result) {
  movieNewData = updateMovieData();

  newData = {};

  newData.movieID = result.d[0].id;
  newData.movieName = result.d[0].l;
  newData.movieYear = result.d[0].y;
  newData.moviePoster = result.d[0].i.imageUrl;
  newData.movieActors = result.d[0].s;

  movieNewData.push(newData);

  // Adds values of movieNewData to Local Storage
  localStorage.setItem("movieData", JSON.stringify(movieNewData));

  console.log(result.d[0].id);
  console.log(result.d[0].l);
  console.log(result.d[0].y);
  // console.log(result.d[0].i); // OUTPUTS ENTIRE ARRAY !!!
  console.log(result.d[0].i.imageUrl);
  console.log(result.d[0].s);
}

// Outputs to Console results of Streaming Service API Call
function consoleStreamingResult(result) {
  result.streamingOptions.us.forEach((instance) => {
    if (instance.type === "addon") {
      console.log(
        `The movie is available as an ${instance.type} on ${
          instance.service.name
        }, in ${instance.quality.toUpperCase()} quality, here: ${
          instance.link
        }.`
      );
    } else if (instance.type === "rent" || instance.type === "buy") {
      console.log(
        `The movie is available to ${instance.type} on ${
          instance.service.name
        }, in ${instance.quality.toUpperCase()} quality for \$${
          instance.price.amount
        }, here: ${instance.link}.`
      );
    } else {
      console.log(
        "The movie isn't currently available on streaming services, in the United States."
      );
    }
  });
}

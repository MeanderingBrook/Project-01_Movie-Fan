async function getStreaming() {
  movieID = "tt0068646";

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
    const result = await response.json({
      // country: "us",
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

getStreaming();

async function getStreamingServices() {
  // API Reference: https://docs.movieofthenight.com/guide/shows

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
    consoleStreamingResult(result);
  } catch (error) {
    console.error(error);
  }
}

function consoleStreamingResult(result) {
  // DID NOT WORK !!! length DID NOT LIMIT RETURNS
  // for (let i = 0; i < result.streamingOptions.us.length; i = i++) {
  //   console.log(
  //     `Streaming Service Type: ${result.streamingOptions.us[i].type}`
  //   );
  //   console.log(
  //     `Streaming Service Name: ${result.streamingOptions.us[i].service}`
  //   );
  // }
  // console.log(`Streaming Service Type: ${result.streamingOptions.us[1].type}`); // WORKS !!!
  // console.log(
  //   `Streaming Service Name: ${result.streamingOptions.us[1].service.name}` // WORKS !!!
  // );
  // DID NOT WORK !!!
  // result.forEach((element, index, array) => {
  //   console.log(element.type);
  //   console.log(element.name);
  // });
  // DID NOT WORK !!!
  // for (let item in Object.keys(result)) {
  //   for (let key in result[item]) {
  //     console.log(result[item][key]);
  //   }
  // }
  // WORKED !!!
  // Object.entries(result.streamingOptions.us).forEach(([key, value]) => {
  //   console.log(key, value);
  // });
  // DID NOT WORK !!!
  // Object.entries(result.streamingOptions.us).forEach(([key, value]) => {
  //   if (key === "type") {
  //     console.log(key, value);
  //   }
  // });
  // DID NOT WORK !!!
  // Object.entries(result.streamingOptions.us.type).forEach(([key, value]) => {
  //   console.log(key, value);
  // });
  // Object.entries(result.streamingOptions.us.type).forEach(([key, value]) => {
  //   console.log(key, value);
  // });
  // for (const [key, value] of Object.entries(result)) {
  //   if (key === "type") {
  //     console.log(`${value}`);
  //   }
  // }
  // DID NOT WORK !!! UNDEFINED
  // Object.entries(result.streamingOptions.us).forEach(function (instance) {
  //   console.log(result.streamingOptions.us.type);
  // });

  // WORKS !!!
  // result.streamingOptions.us.forEach((instance) => {
  //   console.log(
  //     // `The movie is available to ${instance.type} on ${instance.service.name}, in ${instance.quality} for ${instance.price.amount}.`
  //     `The movie is available to ${instance.type} on ${instance.service.name}, in ${instance.quality}.`
  //   );
  //   // console.log(instance.service.name);
  //   // console.log(instance.type);
  // });

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

// getStreamingServices();

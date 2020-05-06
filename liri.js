// Read and set any environment variables with the dotenv package
require("dotenv").config();

// Import the keys.js file and store it in a variable
var keys = require("./keys.js");

// Grab packages
var axios = require("axios");
var moment = require("moment");

// Grab Spotify keys
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

var search = process.argv[2];
var term = process.argv.slice(3).join(" ");

switch (search) {
  case "concert-this":
    concertThis();
    break;
  case "spotify-this-song":
    console.log("spotify-this-song");
    break;
  case "movie-this":
    console.log("movie-this");
    break;
  case "do-what-it-says":
    console.log("do-what-it-says");
    break;
}

function concertThis() {
  console.log(term);

  axios
    .get(
      "https://rest.bandsintown.com/artists/" +
        term +
        "/events?app_id=codingbootcamp"
    )
    .then(function (response) {
      var dataArr = response.data;
      var count = 0;

      dataArr.forEach((e) => {
        var eventDate = moment(e.datetime).format("MM/DD/YYYY");

        console.log(`\r\nEvent ${count + 1}:`);
        console.log(`\tVenue name: ${e.venue.name}`);
        console.log(`\tVenue location: ${e.venue.location}`);
        console.log(`\tEvent date: ${eventDate}`);
        count++;
      });
    })
    .catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an object that comes back with details pertaining to the error that occurred.
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    });
}

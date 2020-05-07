// Read and set any environment variables with the dotenv package
require("dotenv").config();

// Import the keys.js file and store it in a variable
var keys = require("./keys.js");

// Grab packages
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

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
    spotifyThisSong();
    break;
  case "movie-this":
    movieThis();
    break;
  case "do-what-it-says":
    console.log("do-what-it-says");
    break;
  default:
    console.log("\r\nNo command entered.");
}

// Return concert data for a specified artist name
function concertThis() {
  if (term === "") {
    console.log("\r\nNo artist name entered.");
  } else {
    axios
      .get(
        `https://rest.bandsintown.com/artists/${term}/events?app_id=codingbootcamp`
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
        axiosError(error);
      });
  }
}

// Return song data for a specified song title
function spotifyThisSong() {
  if (term === "") {
    console.log("\r\nNo song title entered.");
  } else {
    spotify.search({ type: "track", query: term }, function (err, data) {
      if (err) {
        return console.log("Error occurred: " + err);
      }

      var arrArtistData = data.tracks.items[0].artists;
      var arrArtists = [];
      arrArtistData.forEach((e) => arrArtists.push(e.name));
      var artists = arrArtists.join(", ");

      console.log(`\r\nArtist(s): ${artists}`);
      console.log(`Song name: ${data.tracks.items[0].name}`);
      console.log(
        `Link to song: ${data.tracks.items[0].external_urls.spotify}`
      );
      console.log(`Album: ${data.tracks.items[0].album.name}`);
    });
  }
}

// Return movie data for a specified movie title
function movieThis() {
  if (term === "") {
    console.log("\r\nNo movie title entered.");
  } else {
    axios
      .get(`http://www.omdbapi.com/?apikey=trilogy&t=${term}`)
      .then(function (response) {
        console.log(`\r\nMovie title: ${response.data.Title}`);
        console.log(`Year: ${response.data.Year}`);
        console.log(`IMDb rating: ${response.data.Ratings[0].Value}`);
        console.log(
          `Rotten Tomatoes rating: ${response.data.Ratings[1].Value}`
        );
        console.log(`Country: ${response.data.Country}`);
        console.log(`Language: ${response.data.Language}`);
        console.log(`Actors: ${response.data.Actors}`);
      })
      .catch(function (error) {
        axiosError(error);
      });
  }
}

function doWhatItSays() {}

function axiosError(error) {
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
}

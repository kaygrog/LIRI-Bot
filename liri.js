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

// Get command and search term from user
function getData() {
  var command = process.argv[2];
  var term = process.argv.slice(3).join(" ");
  doSearch(command, term);
}

function doSearch(command, term) {
  switch (command) {
    case "concert-this":
      concertThis(term);
      break;
    case "spotify-this-song":
      spotifyThisSong(term);
      break;
    case "movie-this":
      movieThis(term);
      break;
    case "do-what-it-says":
      doWhatItSays();
      break;
    default:
      console.log("\r\nInvalid command entered.");
  }
}

// Return concert data for a specified artist name
function concertThis(term) {
  if (term === "") {
    console.log("\r\nNo artist name entered.");
  } else {
    axios
      .get(
        `https://rest.bandsintown.com/artists/${term}/events?app_id=codingbootcamp`
      )
      .then(function (response) {
        if (response.data[0] === undefined) {
          throw "";
        } else {
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
        }
      })
      .catch(function () {
        console.log(
          "\r\nThe artist name you entered was invalid or did not return any results. Please try again."
        );
      });
  }
}

// Return song data for a specified song title
function spotifyThisSong(term) {
  if (term === "") {
    console.log("\r\nNo song title entered.");
  } else {
    spotify.search({ type: "track", query: term }, function (err, data) {
      if (err) {
        return console.log(
          "\r\nThe song title you entered was invalid or did not return any results. Please try again."
        );
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
function movieThis(term) {
  if (term === "") {
    console.log("\r\nNo movie title entered.");
  } else {
    axios
      .get(`http://www.omdbapi.com/?apikey=trilogy&t=${term}`)
      .then(function (response) {
        if (response.data.Title === undefined) {
          throw "";
        }

        console.log(`\r\nMovie title: ${response.data.Title}`);
        console.log(`Year: ${response.data.Year}`);
        console.log(`IMDb rating: ${response.data.Ratings[0].Value}`);
        if (response.data.Ratings[1] !== undefined) {
          console.log(
            `Rotten Tomatoes rating: ${response.data.Ratings[1].Value}`
          );
        }
        console.log(`Country: ${response.data.Country}`);
        console.log(`Language: ${response.data.Language}`);
        console.log(`Actors: ${response.data.Actors}`);
      })
      .catch(function (error) {
        console.log(
          "\r\nThe movie title you entered was invalid or did not return any results. Please try again."
        );
      });
  }
}

function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      return console.log(
        "\r\nThere was an error completing your request. Please try again."
      );
    }

    var dataArr = data.split(",");
    var command = dataArr[0];
    var term = dataArr[1];

    // Take quotes out of search term
    if (term.charAt(0) === '"' && term.charAt(term.length - 1) === '"') {
      term = term.substring(1, term.length - 1);
    }

    doSearch(command, term);
  });
}

getData();

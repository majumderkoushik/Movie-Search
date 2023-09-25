var apiKey = "0992671b61f098b3a43eac26509e579e";
var idMovie;
var placeholderImage =
  "https://www.incluvie.com/build/public/img/NoImage_r.jpg";

function getSearchParameters() {
  var params = new URLSearchParams(window.location.search);
  idMovie = params.get("q");
  //saves id to local storage
  localStorage.setItem("id", idMovie);
}

//reassigns page to clicked on movie rec
function loadPage() {
  window.location.assign("results.html?q=" + encodeURIComponent(this.id));
}

//event listener for rec movies
$("body").on("click", ".recommendations-card", loadPage);

//gets description data, title, movie poster, description
function movieData() {
  var detailsRequest =
    "https://api.themoviedb.org/3/movie/" +
    idMovie +
    "?language=en-US&api_key=" +
    apiKey;
  fetch(detailsRequest).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        //displays title
        var title = data.original_title;
        document.querySelector("#title").innerHTML = title;
        //displays storyline
        var storyline = data.overview;
        document.querySelector("#storyline").innerHTML = storyline;
        //displays poster
        var posterPath = data.poster_path;
        var poster = $("#poster");
        poster.attr("src", "https://image.tmdb.org/t/p/w500" + posterPath);
        poster.addClass("rounded");
        poster.attr("alt", title + " poster");
      });
    }
  });
}

// gets name of cast memebers
function moviecredits() {
  var requestCity =
    "https://api.themoviedb.org/3/movie/" +
    idMovie +
    "/credits?language=en-US&api_key=" +
    apiKey;

  fetch(requestCity).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        for (var i = 0; i < 5; i++) {
          if (data.cast[i].profile_path) {
            var profilePicture =
              "https://image.tmdb.org/t/p/w185" + data.cast[i].profile_path;
          } else {
            var profilePicture = placeholderImage;
          }
          var imageDiv = $("<div>");
          var imgTag = $("<img>");
          var pTag = $("<p>");
          var castContent = $("#cast-section");

          castContent.append(imageDiv);
          imageDiv.append(imgTag);
          imageDiv.append(pTag);
          pTag.text(data.cast[i].name);
          pTag.addClass("textColor has-text-weight-bold has-text-centered");
          imgTag.attr("src", profilePicture);
          imgTag.attr("alt", data.cast[i].name + " poster");
          imgTag.addClass("rounded");
        }
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
}

function movieRecommendations() {
  var requestRecommendation =
    "https://api.themoviedb.org/3/movie/" +
    idMovie +
    "/recommendations?&api_key=" +
    apiKey;
  var createRecommendation = $(".recommendations");
  fetch(requestRecommendation)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
    })
    .then(function (data) {
      if (data.results.length === 0) {
        $("#more-movies").hide();
      } else if (data.results.length < 8) {
        for (var i = 0; i < data.results.length; i++) {
          createMovieGrid(createRecommendation, data.results[i]);
        }
      } else {
        for (var i = 0; i < 8; i++) {
          createMovieGrid(createRecommendation, data.results[i]);
        }
      }
    });
}

//displays movie recommendations
function createMovieGrid(location, movieData) {
  //checks if moveData.title exists or movieData.name exists and sets
  if (movieData.title) {
    var movieTitle = movieData.title;
  }
  if (movieData.name) {
    var movieTitle = movieData.name;
  }
  //checks if there is a poster path and if not returns a place holder image
  if (movieData.poster_path) {
    var moviePoster = "https://image.tmdb.org/t/p/w154" + movieData.poster_path;
  } else {
    var moviePoster = placeholderImage;
  }

  var movieId = movieData.id;
  var createDiv = $("<div>");
  var imageDiv = $("<div>");
  var titleDiv = $("<div>");
  var imgTag = $("<img>");
  var pTag = $("<p>");
  location.append(createDiv);
  createDiv.append(imageDiv);
  createDiv.append(titleDiv);
  imageDiv.append(imgTag);
  titleDiv.append(pTag);
  pTag.text(movieTitle);
  pTag.addClass("textColor");
  createDiv.addClass("recommendations-card is-inline-block p-4 m-5");
  imageDiv.addClass("image");
  titleDiv.addClass(
    "content is-medium is-family-sans-serif has-text-black has-text-centered "
  );
  createDiv.attr("id", movieId);
  imgTag.attr("src", moviePoster);
  imgTag.attr("alt", movieTitle + " poster");
}

getSearchParameters();
movieData();
moviecredits();
movieRecommendations();
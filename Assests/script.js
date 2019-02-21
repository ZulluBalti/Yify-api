let form = document.querySelector("form");
let body = document.querySelector("body");
let cont = document.querySelector("#movies");

// Search for movies after submit
form.addEventListener("submit", function(event) {
  event.preventDefault();
  let val = document.querySelector("#searchBox").value;
  if (val) {
    let url = "https://yts.am/api/v2/list_movies.json?query_term=" + val;
    disGif();
    search(url);
  }
});
// Show movies on load
// Making date Year in UI dynamic
window.addEventListener("load", () => {
  let d = new Date();
  document.querySelector(".date__year").textContent = d.getFullYear();
  disGif();
  let url = "https://yts.am/api/v2/list_movies.json";
  search(url);
});
// hide download container/div
body.addEventListener("click", e => {
  // If click on down container
  if (e.target.classList.contains("down__con")) {
    hideDownCon();
  }
});

let box;
let encUrl;

// Show gif
function disGif() {
  cont.innerHTML =
    '<img id="loading" src="images/loading.gif" width="50" height="50">';
}

async function search(url) {
  let res = await fetch(url);
  let data = await res.json();
  console.log(data.data);
  display(data.data);
}

function display(mydata) {
  cont.innerHTML = "";
  // If there is no movie
  if (mydata.movie_count == 0) {
    let para = document.createElement("p");
    para.innerHTML =
      "<b>Sorry, We didn't found any thing<br>Check the spelling or try someghing else.</b>";
    cont.appendChild(para);
  } else {
    mydata.movies.forEach((movie, x) => {
      //appending rows to #movies
      let genre = "";

      if (movie.genres) {
        movie.genres.forEach(g => {
          genre += `${g}, `;
        });
      }
      let hour = Math.floor(movie.runtime / 60);
      let min = movie.runtime % 60;
      let rows = `<div class="movie__box" id="row-${x}">
                    <img class="poster" src="${movie.medium_cover_image}">
                    <div id="info">
                        <h4>${movie.title} (${movie.year})</h4>
                        <span class="clearFix text-success"><strong>Genre: </strong>${genre}</span>
                        <span class="text-success clearFix"><strong>IMDb: </strong>${
                          movie.rating
                        }</span>
                        <span class="text-success clearFix"><strong>Run Time: </strong>${hour}:${min}</span>
                    </div>
                </div>
                `;
      cont.insertAdjacentHTML("beforeend", rows);
    });
  }
  let movie__boxes = document.querySelectorAll(".movie__box");
  movie__boxes = Array.from(movie__boxes);
  movie__boxes.forEach((movie, i) => {
    movie.addEventListener("click", () => {
      downDiv(mydata.movies[i]);
    });
  });
}

function downDiv(data) {
  let y = data.torrents.length;
  let summary =
    data.summary
      .split(" ")
      .slice(0, 30)
      .join(" ") + " ...";
  let mag7 = `magnet:?xt=urn:btih:${
    data.torrents[y - 2].hash
  }&dn=${encUrl}&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80`;

  let mag8 = `magnet:?xt=urn:btih:${
    data.torrents[y - 1].hash
  }&dn=${encUrl}&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80`;

  box = `
        <div class="down__con">
            <div class='down row text-center' id='box'>
                <span class="col-12" id="h3">${data.title}</span>
                <div class="col-6 ver">
                    <h4>720p</h4>
                    <a onclick="hide()" href='${mag7}'><span class="fa fa-magnet"></span></a>
                    <a href='${data.torrents[y - 2].url}'  onclick="hide()">
                        <span  class="fa fa-download"></span>
                    </a>
                    <span class="size">Size: ${data.torrents[y - 2].size}
                    </span>
                </div>
                <div class="col-6">
                    <h4>1080p</h4>
                    <a  onclick="hide()" href='${mag8}'><span class="fa fa-magnet"> </span></a>
                    <a href='${data.torrents[y - 1].url}'  onclick="hide()">
                        <span  class="fa fa-download"></span>
                    </a>
                    <span class="size">Size: ${data.torrents[y - 1].size}
                    </span>
                    </div>
                <p class="col-12">${summary}</p>
                <span onclick="hide()" id="close" class="fa fa-close"></span>
            </div>
        </div>
    `;
  body.insertAdjacentHTML("afterbegin", box);
}

function hide() {
  document.querySelector(".down").style.display = "none";
  hideDownCon();
}

function hideDownCon() {
  document.querySelector(".down__con").style.display = "none";
}

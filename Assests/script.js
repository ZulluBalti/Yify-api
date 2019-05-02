const UIContrl = (() => {
  let domStr = {
    form: document.querySelector("form"),
    body: document.querySelector("body"),
    cont: document.querySelector("#movies"),
    input: document.querySelector("input"),
    year: document.querySelector(".date__year")
  };

  return {
    getDomStr: () => domStr,
    getInputVal: () => domStr.input.value,
    clearInput: () => {
      domStr.input.value = "";
    },
    showLoader: () => {
      let loader = `<img id="loading" src="images/loading.gif" width="50" height="50">`;
      domStr.cont.innerHTML = loader;
    },
    removeLoader: () => {
      domStr.cont.innerHTML = "";
    },
    display: function(data) {
      this.removeLoader();
      // If there is no movie
      if (data.movie_count == 0) {
        let para = document.createElement("p");
        para.setAttribute("class", "error");
        para.innerHTML =
          "<b>Sorry, We didn't find any thing<br>Check the spelling or try something else.</b>";
        domStr.cont.appendChild(para);
      } else {
        data.movies.forEach((movie, x) => {
          //appending rows to #movies
          let genre = "";

          if (movie.genres) {
            movie.genres.forEach((g, i) => {
              i === movie.genres.length - 1
                ? (genre += `${g}`)
                : (genre += `${g}, `);
            });
          }
          let hour = Math.floor(movie.runtime / 60);
          let min = movie.runtime % 60;
          let rows = `<div class="movie__box" id="row-${x}">
                        <img class="poster" src="${movie.medium_cover_image}">
                        <div class="information">
                            <h4>${movie.title} (${movie.year})</h4>
                            <span class="clearFix text-success genres"><strong>Genre: </strong><span>${genre}</span></span>
                            <span class="text-success clearFix"><strong>IMDb: </strong>${
                              movie.rating
                            }</span>
                            <span class="text-success clearFix"><strong>Run Time: </strong>${hour}h ${min}m</span>
                        </div>
                        <div class="parental__guide" id="${
                          movie.imdb_code
                        }">Parental Guide</div>
                    </div>
                    `;
          domStr.cont.insertAdjacentHTML("beforeend", rows);
          const el = document.getElementById(`row-${x}`);
          const height = el.offsetHeight;
          console.log(height);
          document.getElementById(
            `row-${x}`
          ).style.gridRowEnd = `span ${Math.floor(height / 10)}`;
        });
      }
      domStr.cont.style.gridTemplateRows = "repeat(auto-fill, 10px)";
    },
    hideDownload: () => {
      let box = document.querySelector(".down__con");
      box.parentElement.removeChild(box);
    },
    disDownload: data => {
      let summary =
        data.summary
          .split(" ")
          .slice(0, 30)
          .join(" ") + " ...";

      let markup = `
          <div class="down__con close__able">
            <div class='down text-center' id='box'>
              <div id="h3">${data.title}</div>
              <div class="download__quality_box">
      `;

      data.torrents.forEach((torrent, i) => {
        let movie = `
              <div class="down-${i} ver">
                <h4>${torrent.quality}</h4>
                <a href='magnet:?xt=urn:btih:${torrent.hash}&dn=${encodeURI(
          data.title
        )}&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80' class='close__able'><span class="fa fa-magnet close__able"></span></a>
                <a href='${torrent.url}' class='close__able'>
                    <span  class="fa fa-download close__able"></span>
                </a>
                <span class="size">Size: ${torrent.size}
                </span>
              </div>
          `;
        markup += movie;
      });

      markup += `</div>
                <p>${summary}</p>
                <span id="close" class="fa fa-close close__able"></span>
            </div>
          </div>`;
      domStr.body.insertAdjacentHTML("afterbegin", markup);
    },
    showParental: (id, box) => {
      let markup = `
        <div class='parental__guide-con' id=${id}>
          <img id="loading" src="images/loading.gif" width="50" height="50">
        </div>
      `;

      box.insertAdjacentHTML("beforeend", markup);
    },
    fillParent: (id, data) => {
      let list = "";
      for (let i = 1; i < data.length; i++) list += `<li>${data[i]}</li>`;

      let markup = `
          <p class='text-center'>${data[0]}</p>
          <ol class='xes__items'>
            ${list}
          </ol>
      `;

      document.getElementById(id).innerHTML = markup;
    }
  };
})();

const movieContrl = (() => {
  const searchParental = async id => {
    let data;
    try {
      const res = await fetch(
        `http://parental-guide.herokuapp.com/https://www.imdb.com/title/${id}/parentalguide#advisory-nudity`
      );

      data = await res.json();
    } catch (err) {
      console.log("error", err);
      return ["Internal Server Error, Please Come again later."];
    }

    data = JSON.parse(data);
    return data;
  };
  return {
    search: async url => {
      let res = await fetch(url);
      let data = await res.json();
      return data.data;
    },
    parentalSearch: searchParental
  };
})();

const controller = ((UIC, MC) => {
  const addEvents = data => {
    let movie__boxes = document.querySelectorAll(".movie__box");
    movie__boxes = Array.from(movie__boxes);
    movie__boxes.forEach((movie, i) => {
      movie.addEventListener("click", async e => {
        if (e.target.classList.contains("parental__guide")) {
          let id = e.target.id;

          UIC.showParental(`id-${id}`, e.target.parentElement);
          const arr = await MC.parentalSearch(id);

          UIC.fillParent(`id-${id}`, arr);
        } else if (e.target.classList.contains("parental__guide-con")) {
          e.target.parentNode.removeChild(e.target);
        } else {
          UIC.disDownload(data[i]);
        }
      });
    });

    document.querySelector("body").addEventListener("click", e => {
      if (!e.target.classList.contains("parental__guide")) {
        let guide = document.querySelector(".parental__guide-con");
        if (guide) guide.parentNode.removeChild(guide);
      }
    });
  };

  const setupEventListener = (() => {
    const DOM = UIC.getDomStr();

    const displayRes = async url => {
      UIC.showLoader();
      const data = await MC.search(url);
      UIC.display(data);
      addEvents(data.movies);
    };

    // Display movie on form submit
    DOM.form.addEventListener("submit", function(event) {
      event.preventDefault();
      let val = UIC.getInputVal();
      if (val) {
        let url = "https://yts.am/api/v2/list_movies.json?query_term=" + val;
        displayRes(url);
      }
      UIC.clearInput();
    });

    // Show movies on load
    // Making date Year in UI dynamic
    window.addEventListener("load", () => {
      let d = new Date();
      DOM.year.textContent = d.getFullYear();
      let url = "https://yts.am/api/v2/list_movies.json";
      displayRes(url);
    });

    // hide download container/div
    DOM.body.addEventListener("click", e => {
      let closeAble = e.target.classList.contains("close__able");
      if (closeAble) {
        UIC.hideDownload();
      }
    });
  })();
})(UIContrl, movieContrl);

let form = document.querySelector('form');
let body = document.querySelector("body");
let cont = document.querySelector('#movies');

form.addEventListener('submit', function (event) {
    event.preventDefault();
    cont.innerHTML = '<img id="loading" src="images/loading.gif" width="50" height="50">';
    search();
});
window.addEventListener("load", () => {
    let d = new Date();
    document.querySelector(".date__year").textContent = d.getFullYear();
});

let box;
let encUrl;

function search() {
    let val = document.querySelector('#searchBox').value;
    if (val != '') {
        let url = "https://yts.am/api/v2/list_movies.json?query_term=" + val;
        encUrl = encodeURI(url);
        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                display(data);

            });
    }
}

function display(mydata) {
    cont.innerHTML = '';
    if (mydata.data.movie_count == 0) {
        let para = document.createElement('p');
        para.innerHTML = "<b>Sorry, We didn't found any thing<br>Check the spelling or try someghing else.</b>";
        cont.appendChild(para);
    } else {
        for (var x = 0; x < mydata.data.movie_count; x++) {
            //appending rows to #movies
            let genre = '';
            for (let y = 0; y < mydata.data.movies[x].genres.length; y++) {
                genre += mydata.data.movies[x].genres[y] + ', ';
            }

            let rows = document.createElement("div");
            rows.classList.add("row");
            rows.setAttribute("id", "row-" + x);
            rows.innerHTML = '<div class="col-2"><img class="poster" width="150" height="200" src="' + mydata.data.movies[x].medium_cover_image +
                '"></div><div class="col-10" id="info"><h3>' + mydata.data.movies[x].title + ' (' +
                mydata.data.movies[x].year + ')</h3><span class="clearFix text-success"><strong>Genre: </strong>' +
                genre + '<p>' + mydata.data.movies[x].summary + '</p></div>';

            cont.appendChild(rows);


        }
    }
    let rowDiv = [];
    for (i = 0; i < mydata.data.movie_count; i++) {
        rowDiv[i] = document.querySelector("#row-" + i);
        rowDiv[i].addEventListener("click", function () {
            let x = this.getAttribute("id");
            let i = x.substr(4, 1);

            downDiv(mydata.data.movies[i]);
        })
    };
}

function downDiv(data) {
    let y = data.torrents.length;
    let mag7 = "magnet:?xt=urn:btih:" + data.torrents[y - 2].hash + "&dn=" + encUrl + "&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80";
    let mag8 = "magnet:?xt=urn:btih:" + data.torrents[y - 1].hash + "&dn=" + encUrl + "&tr=udp://glotorrents.pw:6969/announce&tr=udp://tracker.opentrackr.org:1337/announce&tr=udp://torrent.gresille.org:80/announce&tr=udp://tracker.openbittorrent.com:80";
    box = document.createElement("div");
    box.classList.add("down");
    box.classList.add("row");
    box.classList.add("text-center");
    box.setAttribute("id", "box");
    box.innerHTML = '<span class="col-12" id="h3">' + data.title + '</span>' +
        '<div class="col-6 ver"><h4>720p</h4><a href=' + mag7 +
        '><span onclick="hide()" class="fa fa-magnet"> </span></a><a href="' +
        data.torrents[y - 2].url +
        '"><span  onclick="hide()" class="fa fa-download"></span></a><span class="size">Size: ' + data.torrents[y - 2].size + '</span></div>' +
        '<div class="col-6"><h4>1080p</h4><a href=' + mag8 +
        '"><span  onclick="hide()" class="fa fa-magnet"> </span></a><a href="' +
        data.torrents[y - 1].url +
        '"><span  onclick="hide()" class="fa fa-download"></span></a><span class="size">Size: ' +
        data.torrents[y - 1].size + '</div><span onclick="hide()"    id="close" class="fa fa-close"></span>';
    body.appendChild(box);

}

function hide() {
    box.style.display = "none";
}
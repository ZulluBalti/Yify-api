let form = document.querySelector('form');
let body = document.querySelector("body");
let cont = document.querySelector('#movies');

form.addEventListener('submit', function(event){
    event.preventDefault();
    cont.innerHTML = '<img id="loading" src="images/loading.gif" width="50" height="50">';
    search();
});

$(document).ready(function(){
                 $(".down").click(function(){
                     console.log("Zullu");
                 });
    
                  $("#close").click(function(){
                    $("#box").hide();
                      console.log("Ali");
})
});

function search(){
    let val = document.querySelector('#searchBox').value;
    if(val != ''){
    // cont.innerHTML = '<img src="images/wait.gif" width="50" height="50">';
     let url = "https://yts.am/api/v2/list_movies.json?query_term="+val;
    fetch(url)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        display(data);
       
    });
    }
}

function display(mydata){
    cont.innerHTML = '';
    if(mydata.data.movie_count == 0){
        let para = document.createElement('p');
        para.innerHTML = "<b>Sorry, We didn't found any thing<br>Check the spelling or try someghing else.</b>";
        cont.appendChild(para);
    }else{
    for(var x=0;x<mydata.data.movie_count;x++){    
        //appending rows to #movies
        
        let rows = document.createElement("div");
        rows.classList.add("row"); rows.setAttribute("id", "row-"+x);
        rows.innerHTML = '<div class="col-2"><img class="poster" width="150" height="200" src="' + mydata.data.movies[x].medium_cover_image + 
            '"></div><div class="col-10" id="info"><h3>' + mydata.data.movies[x].title + ' (' +
            mydata.data.movies[x].year + ')</h3><p>' + mydata.data.movies[x].summary + '</p></div>';
        
        cont.appendChild(rows);
            
       
    }}
    let rowDiv = [];
    for(i=0;i<mydata.data.movie_count;i++){
         rowDiv[i] = document.querySelector("#row-"+i);
         rowDiv[i].addEventListener("click", function(){
             let x = this.getAttribute("id");
             let i = x.substr(4,1);
     
             downDiv(mydata.data.movies[i]);
         })
    };
}
 
function downDiv(data){
    let box = document.createElement("div");
    box.classList.add("down");
    box.classList.add("row");
    box.classList.add("text-center");
    box.setAttribute("id", "box");
    box.innerHTML = '<h3 class="col-12">' + data.title + '</h3><div class="col-6"><h4>720p</h4><a href="' +
                    data.torrents[0].url + 
                    '"><span class="fa fa-download"</span></a></div><div class="col-6"> <h4>1080p</h4><a href="' + 
                    data.torrents[1].url + 
                    '"><span class="fa fa-download"></span></a></div><span id="close" class="fa fa-close"></span>';
    body.appendChild(box);
}



 

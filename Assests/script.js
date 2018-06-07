let form = document.querySelector('form');
let body = document.querySelector("body");
form.addEventListener('submit', function(event){
    event.preventDefault();
    search();
});

function search(){
    let val = document.querySelector('#searchBox').value;
    if(val != ''){
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
    let cont = document.querySelector('#movies');
    cont.innerHTML = '';
    if(mydata.data.movie_count == 0){
        let para = document.createElement('p');
        para.innerHTML = "<b>Sorry, We didn't found any thing<br>Check the spelling or try someghing else.</b>";
        cont.appendChild(para);
    }else{
    for(var x=0;x<mydata.data.movie_count;x++){    
        //appending rows to #movies
        
        let rows = document.createElement("div");
        rows.classList.add("row");
        rows.innerHTML = '<div class="col-2"><img class="poster" width="150" height="200" src="' + mydata.data.movies[x].medium_cover_image + 
            '"></div><div class="col-10" id="info"><h3>' + mydata.data.movies[x].title + ' (' +
            mydata.data.movies[x].year + ')</h3><p>' + mydata.data.movies[x].summary + '</p></div>';
        
        cont.appendChild(rows);
            
       
    }}
    
    
    let divRow = document.querySelector("#movies .row");
    let a = ['a', 'b', 'c']
    console.log(divRow.length); console.log(a.length);
    for(i=0;i<divRow.length;i++){
    divRow[i].addEventListener("click", function(){
        console.log("div NO. " + divRow[i]);
    });
}
}
 
function downDiv(data){
    let box = document.createElement("div");
    box.classList.add("down"); box.classList.add("row");
    box.innerHTML = '<div class="col-6"><h3>720p</h3><a href="' +
                    data.torrents[0].url + 
                    '"><span class="fa fa-download"</span></a></div><div class="col-6"> <h3>1080p</h3><a href="' + 
                    data.torrents[1].url + 
                    '"><span class="fa fa-download"></span></a></div>';
    
    body.appendChild(box);
}



 

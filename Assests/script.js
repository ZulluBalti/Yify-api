let btn = document.querySelector('#searchBtn');

btn.addEventListener('click', search);

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
    })
    }
}

function display(mydata){
    let cont = document.querySelector('#movies');
    cont.innerHTML = '';
    if(mydata.data.movie_count == 0){
        let para = document.createElement('p');
        para.innerHTML = "Sorry, We didn't found any thing<br>Check the spelling or try someghing else.";
        cont.appendChild(para);
    }else
    for(var x=0;x<mydata.data.movie_count;x++){    
        // appending image
        let img = document.createElement('img');
        let imgDiv = document.createElement('div');
        let imgSrc = mydata.data.movies[x].medium_cover_image;
        img.setAttribute('src', imgSrc);img.setAttribute('width', '130');img.setAttribute('height', '120');
        imgDiv.appendChild(img);
        
        // appending title
        let h3 = document.createElement('h3');
        let title = mydata.data.movies[x].title;
        let text_node = document.createTextNode(title);
        h3.appendChild(text_node);
        
        let des = document.createElement('p');
        let desData= mydata.data.movies[x].summary;
        let desTextNode = document.createTextNode(desData);
        des.appendChild(desTextNode);
        //appended des
        let div = document.createElement('div');
        let sec = document.createElement('section');
        
        div.setAttribute('class', 'row');
        imgDiv.setAttribute('class', 'col-2');
        sec.setAttribute('class', 'col-10');
        
        sec.appendChild(h3); sec.appendChild(des);
        div.appendChild(imgDiv);
        div.appendChild(sec);
        cont.appendChild(div);
        
    }
}
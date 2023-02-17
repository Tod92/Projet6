function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function responseToObject(JSONresponse)
{
    let object = JSON.parse(JSONresponse)
    return object
}


const APIbaseUrl = 'http://localhost:8000/api/v1/titles/'

const url = APIbaseUrl + '?year=1920'



function genMovieList(APIurl, nb = 10) {
    const jsonResult = httpGet(APIurl);
    const APIobj = responseToObject(jsonResult);
    let nextPageUrl = APIobj.next;
    let movies = [];
    let nb_results = APIobj.results.length;
    for (let i = 0; i < nb_results; i++) {
        let movie = APIobj.results[i]
        console.log('ajout de ' + movie.title)
        
        movies.push(movie)
        nb--
        if (nb == 0) {
            return movies
        }
    }
    if (nextPageUrl != null) {
        console.log('reccurence :' + nextPageUrl)

        movies.push(...genMovieList(nextPageUrl, nb))
    }
    console.log("genmovielist result : " + movies)
    return movies
}

// function genOnepage(APIurl) {
//     const jsonResult = httpGet(APIurl);
//     const APIobj = responseToObject(jsonResult)
    
//     let result = []
//     let nb_results = APIobj.results.length
//     for (let i = 0; i < nb_results; i++) {
//         let movie = APIobj.results[i]
        
//         console.log('ajout de ' + movie.title)
//         result.push(movie)
//     }
//     return result
// }


// view
function genMovieRow(films, rawNumber, rawTitle, nb = 7) {
    // selection du movie_row visé
    const sectionFilms = document.querySelector("#movie_row" + String(rawNumber))
    // Creation du titre sectionTitle
    const headElement = document.createElement("h1")
    headElement.className = "sectionTitle"
    headElement.innerText = rawTitle
    sectionFilms.appendChild(headElement)
    // Creation de la balise div thumbs
    const thumbsElement = document.createElement("div")
    thumbsElement.className = "thumbs"
    sectionFilms.appendChild(thumbsElement)
    // Creation de la balise ul "img-list"
    const imgListElement = document.createElement("ul")
    imgListElement.className = "img-list"
    

    for (let i = 0; i < nb; i++) {
        const film = films[i]
        
        const liElement = document.createElement('li')
        liElement.className = "image"
        const aElement = document.createElement("a")
        aElement.href = film.imdb_url
        const imgElement = document.createElement("img")
        imgElement.src = film.image_url
        aElement.appendChild(imgElement)
        liElement.appendChild(aElement)
        imgListElement.appendChild(liElement)
    }
    sectionFilms.appendChild(imgListElement)
}


const movies = genMovieList(url, 10)
for (let i = 0; i < 20; i++) {
    
}


genMovieRow(movies, 3)
// document.querySelector(".films").innerHTML = ""


console.log("je suis à la fin du script js :)")
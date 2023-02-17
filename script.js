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
function genMovieRow(films, nb = 7) {
    for (let i = 0; i < nb; i++) {
        const film = films[i]
        const sectionFilms = document.querySelector("#movie_row1")
        const titleElement = document.createElement('h1');
        titleElement.innerText = film.title;
        const imdbScoreElement = document.createElement('p')
        imdbScoreElement.innerText = "score imdb : " + film.imdb_score
        sectionFilms.appendChild(titleElement)
        sectionFilms.appendChild(imdbScoreElement)
        
    }
}


const movies = genMovieList(url, 10)
for (let i = 0; i < 20; i++) {
    
}


genMovieRow(movies, 10)
// document.querySelector(".films").innerHTML = ""
console.log("je suis à la fin du script js :)")
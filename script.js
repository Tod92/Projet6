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
const url2 = APIbaseUrl + '?year=1920' + "?sort_by=&title"
//'?imdb_score=5'
//"?sort_by= -(pour inverser) dans url avec tous les filtres"

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
    // Creation de la liste d'image et boucle pour chaque image
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
        const spanElement = document.createElement("span")
        spanElement.className = "text-content"
        spanElement.innerHTML = "<br><br><br><br><br><br><br><br><br><br><br><br><br><br>" + film.title
        aElement.appendChild(spanElement)
        liElement.appendChild(aElement)
        imgListElement.appendChild(liElement)
    }
    sectionFilms.appendChild(imgListElement)
}

// On genere le row des meilleurs films par note imdb
const url_bestImdbScores = APIbaseUrl + "?sort_by=-imdb_score&imdb_score_min=9"
const movies2 = genMovieList(url_bestImdbScores, 7)
genMovieRow(movies2, 2, "Meilleurs scores ImDb")

// On genere le row des meilleurs films par catégorie "Drama"
const url_bestDramas = APIbaseUrl + "?sort_by=-imdb_score&genre_contains=Animation"
const movies3 = genMovieList(url_bestDramas, 7)
genMovieRow(movies3, 3, "Meilleurs films d'animation")

// On genere le row des meilleurs films de 2022
const url_best2022 = APIbaseUrl + "?sort_by=-imdb_score&gyear=2022"
const movies4 = genMovieList(url_best2022, 7)
genMovieRow(movies4, 4, "Meilleurs films de 2022")

// document.querySelector(".films").innerHTML = ""

const SectionBoutton = document.querySelector("#left1")
const imgElement = document.createElement("img")
imgElement.src = "images\\left.png"
imgElement.alt = "left_arrow"
imgElement.height = 260
imgElement.width = 45
SectionBoutton.appendChild(imgElement)
console.log("je suis à la fin du script js :)")
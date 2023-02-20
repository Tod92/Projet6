// Data
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

function genMovieList(APIurl, nb = 28) {
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
            console.log("genmovielist result : " + movies)
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
function genMovieRow(films, rawNumber, rawTitle, nb = 7, page = 2) {
    document.querySelector("#movie_row" + String(rawNumber)).innerHTML=""
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
    // Bouton page precedente
    if (page > 1) {
        const IdSelectorName = "left" + String(rawNumber)
        const SectionBouttonLeft = document.createElement("a")
        SectionBouttonLeft.id = IdSelectorName
        SectionBouttonLeft.href = "#"
        const imgElement = document.createElement("img")
        imgElement.src = "images\\left.png"
        imgElement.alt = "left_arrow"
        imgElement.height = 120
        imgElement.width = 45
        SectionBouttonLeft.appendChild(imgElement)
        imgListElement.appendChild(SectionBouttonLeft)
    }
    // Liste des films
    for (let i = 0; i < nb; i++) {
        const film = films[i]
        
        const liElement = document.createElement('li')
        liElement.className = "image"
        const aElement = document.createElement("a")
        aElement.href = film.imdb_url
        const imgElement = document.createElement("img")
        imgElement.src = film.image_url
        imgElement.height = 280
        imgElement.width = 180
        aElement.appendChild(imgElement)
        const spanElement = document.createElement("span")
        spanElement.className = "text-content"
        spanElement.innerHTML = "<br><br><br><br><br><br><br><br><br><br><br><br><br><br>" + film.title
        aElement.appendChild(spanElement)
        liElement.appendChild(aElement)
        imgListElement.appendChild(liElement)
    }
    // Bouton page suivante
    if (page < 4) {
        const IdSelectorNameRight = "right" + String(rawNumber)
        const SectionBouttonRight = document.createElement("a")
        SectionBouttonRight.id = IdSelectorNameRight
        SectionBouttonRight.href = "#"
        const imgElement = document.createElement("img")
        imgElement.src = "images\\right.png"
        imgElement.alt = "right_arrow"
        imgElement.height = 120
        imgElement.width = 45
        SectionBouttonRight.appendChild(imgElement)
        imgListElement.appendChild(SectionBouttonRight)
    }
    sectionFilms.appendChild(imgListElement)
}

// On genere le row des meilleurs films par note imdb
const url_bestImdbScores = APIbaseUrl + "?sort_by=-imdb_score&imdb_score_min=9"
const movies2 = genMovieList(url_bestImdbScores)
genMovieRow(movies2, 2, "Meilleurs scores ImDb")

// On genere le row des meilleurs films par catégorie "Drama"
const url_bestDramas = APIbaseUrl + "?sort_by=-imdb_score&genre_contains=Animation"
const movies3 = genMovieList(url_bestDramas)
genMovieRow(movies3, 3, "Meilleurs films d'animation")

// On genere le row des meilleurs films de Tarantino
const url_bestTarantino = APIbaseUrl + "?sort_by=-imdb_score&writer_contains=tarantino&director_contains=tarantino"
const movies4 = genMovieList(url_bestTarantino)
genMovieRow(movies4, 4, "Meilleurs films de Quentin Tarantino")

// document.querySelector(".films").innerHTML = ""


const SectionBouttonLeft1 = document.querySelector("#left1")
const imgElement = document.createElement("img")
imgElement.src = "images\\left.png"
imgElement.alt = "left_arrow"
imgElement.height = 120
imgElement.width = 45
SectionBouttonLeft1.appendChild(imgElement)

const SectionBouttonRight1 = document.querySelector("#right1")
const imgElement2 = document.createElement("img")
imgElement2.src = "images\\right.png"
imgElement2.alt = "right_arrow"
imgElement2.height = 120
imgElement2.width = 45
SectionBouttonRight1.appendChild(imgElement2)


for (let i = 0; i < 4; i++) {
    let leftId = "left" + String(i+1)
    document.getElementById(leftId).onclick = function() {myFunction(leftId)};
    console.log("init bouton id : " + leftId)
    let rightId = "right" + String(i+1)
    document.getElementById(rightId).onclick = function() {myFunction(rightId)};
    console.log("init bouton id : " + rightId)

}
// document.getElementById("left1").onclick = function() {myFunction("left1")};
  
// document.getElementById("right1").onclick = function() {genMovieRow(movies2, 1, "coucou")};
  
function myFunction(elementId) {
  console.log("tu a cliqué sur " + elementId);
}
console.log("je suis à la fin du script js :)")
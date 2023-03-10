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


// Fonction de recuperation de la liste de film sur l'API
function genMovieList(APIurl, nb = 7) {
    const jsonResult = httpGet(APIurl);
    const APIobj = responseToObject(jsonResult);
    let nextPageUrl = APIobj.next;
    let movies = [];
    let nb_results = APIobj.results.length;
    for (let i = 0; i < nb_results; i++) {
        let movie = APIobj.results[i]
        console.log('exctraction du film: ' + movie.title)
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
    return movies
}

function getMovieDetails(APIurl) {
    console.log("requete api pour detail film : " + APIurl)
    const jsonResult = httpGet(APIurl);
    const APIobj = responseToObject(jsonResult);
    return APIobj
}

// View

// Fonction d'affichage du film en vedette "meilleur film"
function showBestMovie(movie) {
    const sectionBestMovie = document.getElementById("best_movie")
    sectionBestMovie.innerHTML = "<h1 class=\"sectionTitle\"> Meilleur film : " + movie.title + "</h1>"
                                +"<div class=\"container\">"
                                +"<img src =\"" + movie.image_url + "\">" 
                                + "<span><br><b>"+ movie.title 
                                + "<br><br><input id =\"btn-bestmovie\" type=\"button\" value=\"Détails\">"
                                + "</b><br><br>" + movie.long_description + "</b>"
                                + "</span></div><br><br>"

}

//Fonction d'affichage des listes de films et fleches de navigation
function genMovieRow(films, rawNumber, rawTitle, nb = 7, page = 1) {
    // selection du movie_row visé
    document.querySelector("#movie_row" + String(rawNumber)).innerHTML=""
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
        SectionBouttonLeft.href = "javascript:void(0)"
        const imgElement = document.createElement("img")
        imgElement.className = "arrow"
        imgElement.src = "images\\left.png"
        imgElement.alt = "left_arrow"
        // imgElement.height = 120
        // imgElement.width = 45
        SectionBouttonLeft.appendChild(imgElement)
        imgListElement.appendChild(SectionBouttonLeft)
    }

    // Liste de vignettes films
    for (let i = 0; i < nb; i++) {
        const film = films[i]
        
        const liElement = document.createElement('li')
        liElement.className = "image"
        const aElement = document.createElement("a")
        aElement.href = "javascript:void(0)"
        aElement.id = "movie" + String(rawNumber) + String(i)
        const imgElement = document.createElement("img")
        imgElement.src = film.image_url
        imgElement.height = 280
        imgElement.width = 160
        aElement.appendChild(imgElement)
        const spanElement = document.createElement("span")
        spanElement.className = "text-content"
        spanElement.innerHTML = "<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>" + film.title
        aElement.appendChild(spanElement)
        liElement.appendChild(aElement)
        imgListElement.appendChild(liElement)
    }

    // Bouton page suivante
    if (page < 4) {
        const IdSelectorNameRight = "right" + String(rawNumber)
        const SectionBouttonRight = document.createElement("a")
        SectionBouttonRight.id = IdSelectorNameRight
        SectionBouttonRight.href = "javascript:void(0)"
        const imgElement = document.createElement("img")
        imgElement.className = "arrow"
        imgElement.src = "images\\right.png"
        imgElement.alt = "right_arrow"
        // imgElement.height = 120
        // imgElement.width = 45
        SectionBouttonRight.appendChild(imgElement)
        imgListElement.appendChild(SectionBouttonRight)
    }
    sectionFilms.appendChild(imgListElement)
}

// Classe row avec methodes pour rafraichissement des affichages
class Row {
    constructor(number, api_url, title, page) {
        this.number = number
        this.api_url = api_url
        this.title = title
        this.page = page
        this.movies = this.get_movies()
    }
    get_movies() {
        let range = (this.page * 7)
        // Cas row1 : augmentation de la liste de 1 pour la vignette
        if (this.number === 1) {
            range += 1
        }
        return genMovieList(this.api_url, range)
    }
    show() {
        // Slice pour se positionner au bon endroit de la liste avant affichage
        let range = (this.page * 7)
        // Cas row1 : augmentation de la range de 1 pour ignorer le premier élement
        if (this.number === 1) {
            range += 1
        }
        let sliced_movies = this.movies.slice((range-7),range)
        genMovieRow(sliced_movies, this.number, this.title, 7, this.page)
    }
    showNext() {
        this.page += 1;
        let range = (this.page * 7)
        if (this.movies.length < range) {
            console.log("showNext loading movie list(length : " + String(range))
            this.movies = this.get_movies()
        }
        // Cas ou il n'y a plus de films à afficher
        if (this.movies.length === (range - 7)) {
            this.page -= 1;
            alert("Pas d'avanatage de film de cette catégorie")
            return "no_more"
        }
        this.show()
    }
    showPrevious() {
        this.page -= 1;
        this.show()
    }
    showModal(movie_index) {
        if (this.number == 1) {
            movie_index +=1;
        }
        // Cas particulier lors de l'appel pour bestMovie
        if (movie_index != 0) {
        movie_index += (this.page - 1) * 7;
        }
        let movie = this.movies[movie_index]
        console.log("MODAL DEMANDE POUR :" + movie.title)
        var modal = document.getElementById("myModal");
        var btn = document.getElementById("myBtn");
        var span = document.getElementsByClassName("close")[0];
        var modalText = document.getElementsByClassName("modal-text")[0];
        modalText.innerHTML = "Chargement "
        modal.style.display = "block";
        var detailedMovie = getMovieDetails(movie.url)
        // modalText.innerHTML =
        var modalConstruct ="<img src=\"" + detailedMovie.image_url + "\">" +
                            "<p>" + "<b>" + detailedMovie.title + "</b>" +
                            "<br><br>" + "Genres :";
        for (const genre of detailedMovie.genres) {
            modalConstruct += " " + genre
        }
        modalConstruct += "<br>" + "Année de sortie : " + detailedMovie.date_published
        modalConstruct += "<br>" + "Rated : " + detailedMovie.rated
        modalConstruct += "<br>" + "Score Imdb : " + detailedMovie.imdb_score
        modalConstruct += "<br>" + "Realisateur(s) :"
        for (const real of detailedMovie.directors) {
            modalConstruct += " " + real 
        }
        modalConstruct += "<br>" + "Acteur(s) :"
        for (const actor of detailedMovie.actors) {
            modalConstruct += " " + actor 
        }
        modalConstruct += "<br>" + "Durée (mn) : " + String(detailedMovie.duration)
        modalConstruct += "<br>" + "Pays d'origine :"
        for (const pays of detailedMovie.countries) {
            modalConstruct += " " + pays 
        }
        modalConstruct += "<br>" + "Résultat Box Office: " + String(detailedMovie.worldwide_gross_income)
        modalConstruct += " " + detailedMovie.budget_currency
        modalConstruct += "<br>" + "Résumé du film : " + "<br>" + detailedMovie.long_description

        modalConstruct += "</p>"
        modalText.innerHTML = modalConstruct

       // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
            modal.style.display = "none";
          }
        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
            modal.style.display = "none";
            }
        }
    }
}

// Listener et fonctions onArrowClick

// Boucle pour "écouter" les boutons de défilement et le bouton détails bestMovie
function Listener() {
    // Pour les arrows next et previous
    for (let i = 0; i < 3; i++) {
        let leftId = "left" + String(i+1)
        try { document.getElementById(leftId).onclick = function() {onArrowClick(leftId)};
        console.log("init bouton id : " + leftId) } catch (TypeError) {
            console.log("Bouton non trouvé : " + leftId)}
       
    
        let rightId = "right" + String( i+1)
        try { document.getElementById(rightId).onclick = function() {onArrowClick(rightId)};
        console.log("init bouton id : " + rightId)} catch (TypeError) {
            console.log("Bouton non trouvé : " + rightId)}
        }
    // Pour les vignettes de film et call modal
    for (let i = 0; i < 3; i++) {
        let rowId = "movie_row" + String(i +1)
        const rowElement = document.querySelector(rowId)
        for (let a = 0; a < 7; a++) {
            let aId = "movie" + String(i+1) + String(a)
            document.getElementById(aId).onclick = function() {onImgClick(rowId,a)};
        }
    }
    document.getElementById("btn-bestmovie").onclick = function() {onImgClick("best-movie",0)};
    
}

function onImgClick(row_id, movie_index) {
    console.log("tu a cliqué sur " + row_id + "image " + movie_index)
    if (row_id == "movie_row1") {
        row1.showModal(movie_index)
    }
    if (row_id == "movie_row2") {
        row2.showModal(movie_index)
    }
    if (row_id == "movie_row3") {
        row3.showModal(movie_index)
    }
    // cas particulier pour BestMovie
    if (row_id == "best-movie") {
        row1.showModal(-1)
    }
}

function onArrowClick(elementId) {
    console.log("tu a cliqué sur " + elementId);
    if (elementId == "right1") {
        row1.showNext()
    }
    if (elementId == "left1") {
        row1.showPrevious()
    }
    if (elementId == "right2") {
        row2.showNext()
    }
    if (elementId == "left2") {
        row2.showPrevious()
    }
    if (elementId == "right3") {
        row3.showNext()
    }
    if (elementId == "left3") {
        row3.showPrevious()
    }
    Listener();
  }

// Main

// On genere le row des meilleurs films par note imdb
// ! specificité : on isole le premier résultat de la liste pour la vignette meilleur film

const url_bestImdbScores = APIbaseUrl + "?sort_by=-imdb_score&imdb_score_min=9"
const row1 = new Row(1, url_bestImdbScores, "Meilleurs scores ImDb", 1)
const bestMovie = row1.movies[0]
console.log("bestMovie = " + bestMovie.title)
const detailedBestMovie = getMovieDetails(bestMovie.url)
showBestMovie(detailedBestMovie)
row1.show()


// On genere le row des meilleurs films par catégorie "Animation"
const url_bestAnimations = APIbaseUrl + "?sort_by=-imdb_score&genre_contains=Animation"
const row2 = new Row(2, url_bestAnimations, "Meilleurs films d'animation", 1 )
row2.show()

// On genere le row des meilleurs films de Tarantino
const url_bestTarantino = APIbaseUrl + "?sort_by=-imdb_score&writer_contains=tarantino&director_contains=tarantino"
const row3 = new Row(3, url_bestTarantino,"Meilleurs films de Quentin Tarantino", 1)
row3.show()

// Purge du message de chargement
document.querySelector("#loading").innerHTML=""

// Lancement initial du listener pour les elements cliquables
Listener()

// Fin du script
console.log("fin de l'execution du script js")


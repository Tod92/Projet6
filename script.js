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


function genMovieList(APIurl, nb = 7) {
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

function getMovieDetails(APIurl) {
    console.log("requete api pour detail film : " + APIurl)
    const jsonResult = httpGet(APIurl);
    const APIobj = responseToObject(jsonResult);
    return APIobj
}


// view
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

// model pour row 
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
        console.log("show range : " + String(range))
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
        this.show()
    }
    showPrevious() {
        this.page -= 1;
        this.show()
    }
    showModal(movie_index) {
        movie_index += (this.page - 1) * 7;
        if (this.number == 1) {
            movie_index +=1;
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
        modalConstruct += "</p>"

        // Son réalisateur
        // La liste des acteurs
        // Sa durée
        // Le pays d’origine
        // Le résultat au Box Office
        // Le résumé du film
    
        modalText.innerHTML = modalConstruct
        
                            
        // modal.style.display = "block";
        
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


// On genere le row des meilleurs films par note imdb
// ! specificité : on isole le premier résultat de la liste pour la vignette meilleur film

const url_bestImdbScores = APIbaseUrl + "?sort_by=-imdb_score&imdb_score_min=9"
const row1 = new Row(1, url_bestImdbScores, "Meilleurs scores ImDb", 1)
const bestMovie = row1.movies[0]
console.log("bestMovie = " + bestMovie.title)
row1.show()


// On genere le row des meilleurs films par catégorie "Animation"
const url_bestAnimations = APIbaseUrl + "?sort_by=-imdb_score&genre_contains=Animation"
const row2 = new Row(2, url_bestAnimations, "Meilleurs films d'animation", 1 )
row2.show()

// On genere le row des meilleurs films de Tarantino
const url_bestTarantino = APIbaseUrl + "?sort_by=-imdb_score&writer_contains=tarantino&director_contains=tarantino"
const row3 = new Row(3, url_bestTarantino,"Meilleurs films de Quentin Tarantino", 1)
row3.show()

document.querySelector("#loading").innerHTML=""

// Boucle pour "écouter" les boutons de défilement gauche et droite
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
            console.log("aId = " + aId)
            document.getElementById(aId).onclick = function() {onImgClick(rowId,a)};

        }

    }
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
    if (elementId == "right4") {
        row4.showNext()
    }
    if (elementId == "left4") {
        row4.showPrevious()
    }
    Listener();
  }


  Listener()

//   const sectionBestMovie = document.querySelector("#best_div")
//   const imageElement = document.createElement("img")
//   imageElement.className = "img-best"
//   imageElement.src = row1.movies[0].image_url
//   imageElement.innerText = "Test coucou caca pipi coco"
//   sectionBestMovie.appendChild(imageElement)
//   const descritpionElement = document.createElement("span")
//   descritpionElement.className = "desc-best"
//   descritpionElement.innerText = "TITRE DU FILM"
//   sectionBestMovie.appendChild(descritpionElement)


  console.log("je suis à la fin du script js :)")


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



function genMovieList(APIurl) {
    const jsonResult = httpGet(APIurl);
    const APIobj = responseToObject(jsonResult)
    let nextPageUrl = APIobj.next
    let result = []
    let nb_results = APIobj.results.length
    for (let i = 0; i < nb_results; i++) {
        let movie = APIobj.results[i]
        
        console.log('ajout de ' + movie.title)
        result.push(movie)
    }
    if (nextPageUrl != null) {
        console.log('reccurence :' + nextPageUrl)
        result += genMovieList(nextPageUrl)
    }
    return result
}

function genOnepage(APIurl) {
    const jsonResult = httpGet(APIurl);
    const APIobj = responseToObject(jsonResult)
    
    let result = []
    let nb_results = APIobj.results.length
    for (let i = 0; i < nb_results; i++) {
        let movie = APIobj.results[i]
        
        console.log('ajout de ' + movie.title)
        result.push(movie)
    }
    return result
}

const movies = genOnepage(url)
for (let i = 0; i < 20; i++) {
    
}
console.log(movies)
console.log(movies[0])
console.log(movies[0][0])
console.log(movies[0].title)

for (let i=0; i < movies.length; i++) {
    console.log(movies[i].title)
    console.log(movies[i].imdb_score)
}
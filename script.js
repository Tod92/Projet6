function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
const APIbaseUrl = 'http://localhost:8000/api/v1/titles/'

const url = APIbaseUrl + '?year=1987'

alert(httpGet(url));


console.log("Hi");
const script = document.createElement('script');
script.innerHTML = 'Object.defineProperty(navigator, \'globalPrivacyControl\', {get: () => true, set: (v) => {}});';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

console.log(httpGet("https://www.xfinity.com/privacy/manage-preference"));
console.log("CALL GET");


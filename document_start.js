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

//console.log("Hi3");
//if (window.location.href!="https://www.xfinity.com/privacy/manage-preference"){
//    window.location="https://www.xfinity.com/privacy/manage-preference";
//}
//console.log("Hi4");

setTimeout(function(){
    var elems=document.body.getElementsByTagName("*");//Do Not Sell My Personal Information
    console.log("Hi5",elems);
    for(var i=0;i<elems.length;i++){
        console.log("tag6",elems[i].textContent);
        console.log("tag7",elems[i].innerText);
        console.log("tag8",elems[i].href);
    }
}, 2000);

//document.getElementById('digital-footer-bottom-link-bottom-9').click();

//<a class="xc-footer--terms-link" href="https://www.xfinity.com/privacy/manage-preference" id="xc-footer--terms">Do Not Sell My Personal Information</a>

//document.getElementById('xc-footer--terms').click();





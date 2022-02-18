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

var elementsList = new Array();

// TODO: GPC Checker
function GPCChecker(){

}

// TODO: Extract Elements
// return [elem1, elem2, ...]
function extractElements(){

}

// TODO: Extract Text
// return [String1, String2, ...]
function extractText(elemList){

}

// TODO: @Naimu @Xiaoxin Text mining
// input: [String1, String2,...]
// output: [0/1: whether this website declares it will not sell data ,[3,1,2,...]
// (level, 1 = do not sell 2 = privacy settings/policy)]
function textMining(stringList){

}

// TODO: filter results, only reserve related elements
function filterResult(resultList){

}

// TODO: Create peer button on the extension page, onclick = click original buttons on the page.
// @ Jack
// elemObject: {category: 0/1... (0 = do not sell, 1 = delete my data); id: xxx-xxx-xxx}
// defaultDoNotSell: true/false whether this website declares it will not sell data
// doNotSellText: related text paragraphs.
// No output
function createPeerButton(elementObjList, defaultDoNotSell,doNotSellText){
    // document.getElementById('elem1.id').click();
}

// DB Fields
// Host, defaultDNS, supportGPC, supportDNS, have-set(local), DNS-text
function localDatabase(){
    // ...
}
const script = document.createElement('script');
script.innerHTML = 'Object.defineProperty(navigator, \'globalPrivacyControl\', {get: () => true, set: (v) => {}});';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
updateDemo()

function sendhttpPOST(url, parsefunc, req) {
    var value;
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            var json = httpRequest.responseText;
            parsefunc(json)
        }
    };
    httpRequest.open('POST', url, true);
    reqJSON = JSON.stringify(req)
    httpRequest.send(reqJSON);
    console.log(httpRequest.responseText)
    return httpRequest.responseText
}

function testParser(respJSON){
    console.log("test parser")
    console.log(respJSON)
}

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

//console.log(httpGet("https://www.xfinity.com/privacy/manage-preference"));
//console.log("CALL GET");

//console.log("Hi3");
//if (window.location.href!="https://www.xfinity.com/privacy/manage-preference"){
//    window.location="https://www.xfinity.com/privacy/manage-preference";
//}
//console.log("Hi4");

//document.getElementById('digital-footer-bottom-link-bottom-9').click();

//<a class="xc-footer--terms-link" href="https://www.xfinity.com/privacy/manage-preference" id="xc-footer--terms">Do Not Sell My Personal Information</a>

//document.getElementById('xc-footer--terms').click();


//GPC Checker: currently, I think this should work for any site listed on https://well-known.dev/?q=resource:%22gpc%22#results.
// https://developer.mozilla.org/en-US/docs/Web/API/Window/location
// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
function GPCChecker(){
    let currentUrl = location.href;
    console.log(currentUrl);
    let wellKnownObject = ".well-known/gpc.json";
    let urlToObject = currentUrl + wellKnownObject;
    console.log(urlToObject);
    function reqListener () {
        console.log(this.responseText);
    }
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.addEventListener("load", reqListener);
    xmlHttp.open( "GET", urlToObject, false ); // false for synchronous request
    xmlHttp.send();
}
GPCChecker();

// TODO: Extract Elements
// return [elem1, elem2, ...]
function extractElements(){
    var elemTextList=[];
//    setTimeout(function(){
        var  elems=document.body.getElementsByTagName("*");
        for(var i=0;i<elems.length;i++){
            elemTextList.push(elems[i].textContent);
//            console.log("tag6",elems[i].textContent);
//            console.log("tag7",elems[i].innerText);
//            console.log("tag8",elems[i].href);
        }
//    }, 2000);
    return elemTextList;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function delayedGreeting() {
  await sleep(2000);
  var elementsList = extractElements();
  console.log("elementsList",elementsList);
  console.log("Goodbye!",elementsList[1211]);
}

delayedGreeting();




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
async function useOptOut(elementObjList, defaultDoNotSell,doNotSellText){
    // document.getElementById('elem1.id').click();
    // https://stackoverflow.com/questions/3813294/how-to-get-element-by-innertext

    await sleep(2000);
    var aTags = [].slice.call(document.getElementsByTagName("a"));
    console.log(aTags.length);
    var searchText = "Do Not Sell My Personal Information";
    var found;
    console.log("test");
    for (let i = 0; i < aTags.length; i++) {
        if (aTags[i].outerText == searchText) {
            found = aTags[i];
            break;
        }
    }
}
useOptOubt();

function updateDemo(){
    console.log("now test update")
    req = new Object()
    req.host = "www.cmu2.edu"
    detail = new Object()
    detail.right_type = "CCPADelete"
    detail.exercise_path = new Array()
    node1 = new Object()
    node1.text = "Privacy Policies"
    node1.category = "input"
    node1.operation_type = "click"
    node1.html_id = "a7"
    detail.exercise_path.push(node1)

    node2 = new Object()
    node2.text = "Delete my data"
    node2.category = "input"
    node2.operation_type = "click"
    node2.html_id = "a9"
    detail.exercise_path.push(node2)

    req.exercise_detail = detail
    sendhttpPOST("http://127.0.0.1:8080/update_website_attr",testParser,req)
}
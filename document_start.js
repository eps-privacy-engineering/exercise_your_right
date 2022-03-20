const script = document.createElement('script');
script.innerHTML = 'Object.defineProperty(navigator, \'globalPrivacyControl\', {get: () => true, set: (v) => {}});';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);

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



// text searching part 
// return1: [String1, String2, ...]
// return2 dictionary {topic: link}
function extractElements(){
    var elemTextList=[];
    var dict = new Object();
        var  elems=document.body.getElementsByTagName("*");
        for(var i=0;i<elems.length;i++){
            elemTextList.push(elems[i].textContent)
            if (elems[i].href) 
            {
            dict[elemTextList[i]]=elems[i].href
            }
        }
    return [elemTextList, dict]
}
//if we need plain text only
function extractText(){
    return extracttextElements()[0]
}

//get required information
// resultDict=extractElement()[1]
//first get three kinds of links
function filterResult_text_link_pair(resultDict){
    var DNS_link=[];
    var priacy_policy_link=[];
    var data_collection_link=[];
    const text1=/do not sell|do not share|do not collect/ig
    const text2=/privacy policy/ig
    const text3=/data collection/ig
    for (const [key, value] of Object.entries(resultDict)) 
    {
      if (key.match(text1))
        {
            DNS_link.push([key, value])
        }
      else if (key.match(text2))
        {
            priacy_policy_link.push([key, value])
        }
      else if (key.match(text3))
        {
            data_collection_link.push([key, value])
        }
    }
    return [DNS_link,priacy_policy_link,data_collection_link]
}

//get plain privacy-related text information
//resultList==extractElement()[0]
function filterResult_keyword(resultDict){
    var DNS_key_word=[];
    var priacy_policy_key_word=[];
    var CCPA_key_word=[]
    var Data_collection_key_word=[]
    const text1=/do not sell|do not share|do not collect/ig
    const text2=/privacy policy/ig
    const text3=/CCPA|california resident|California Consumer Privacy Act/ig
    const text4=/data collection/ig
     for(var i=0;i<resultDict.length;i++) 
    {
      if (resultDict[i].match(text1))
        {
            DNS_key_word.push(resultDict[i])
        }
      else if (resultDict[i].match(text2))
        {
            priacy_policy_key_word.push(resultDict[i])
        }
      else if (resultDict[i].match(text3))
        {
            CCPA_key_word.push(resultDict[i])
        }
      else if (resultDict[i].match(text4))
        {
            Data_collection_key_word.push(resultDict[i])
        }
    }
    return [DNS_key_word,priacy_policy_key_word, CCPA_key_word,Data_collection_key_word]
}
//e.g. filterResult_text_link_pair(extracttextElements()[1])

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
useOptOut();

// DB Fields
// Host, defaultDNS, supportGPC, supportDNS, have-set(local), DNS-text
function localDatabase(){
    // ...
}
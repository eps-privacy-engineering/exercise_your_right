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
function extracttextElements(){
    var elemTextList=[];
    var dict = new Object();
    var  elems=document.getElementsByTagName("*");
    for(var i=0;i<elems.length;i++){
    elemTextList.push([elems[i].textContent,elems[i].tagName, elems[i].href, elems[i].id])
    }
    return elemTextList
}

//get required information
function filterResult(result){
    var information=new Object();
    information["Do Not Sell"]=[];
    information["delete information"]=[];
    information["Opt-out/in"]=[];
    information["Privacy Policy"]=[];
    information["CCPA-only"]=[];
    const text1=/do not sell|do not share|do not collect|do-not-sell|do_not_sell|do-not-share|do_not_share|do-not-collect|do_not_collect/ig
    const text2=/CCPA.*delete|delete my data|delete-my-data|delete_my_data |remove my data|remove-my-data|remove_my_data|remove personal info|remove-personal-info|remove_personal_info|delete my info|delete-my-info|delete_my_info|remove my info|remove-my-info|remove_my_info|remove your info|remove-your-info|remove_your_info/ig
    const text3=/opt out|opt in|opt-in|opt-out|opt_out|opt_in|optin|optout/ig
    const text4=/privacy policy|privacy-policy|privacy-notice|privacy_policy|privacy_notice|privacy notice|privacy.*a>|<a.*privacy|/ig
    const text5=/CCPA|California Comsumer Privacy Act|Califormia-Consumer-Privacy-Act/ig
    //const text5=/data collection/ig
    
    var count = result.length;
    for(var i = 0; i < count; i++) {
        var item = result[i];
        if (typeof item[0] !== "undefined")
        {
        
          if (item[0].match(text1))
            {
                information["Do Not Sell"].push( [item[1], item[2], item[3]])
            }
          else if (item[0].match(text2))
            {
                information["delete information"].push([item[1], item[2], item[3]])
            }
          else if (item[0].match(text3))
            {
                information["Opt-out/in"].push([item[1], item[2], item[3]])
            }
          else if (item[0].match(text4))
            {
                information["Privacy Policy"].push([item[1], item[2], item[3]])
            }
          else if (item[0].match(text5))
            {
                information["CCPA-only"].push([item[1], item[2], item[3]])
            }  
     }
    }
    if (information["Do Not Sell"].length===0){
        information["Do Not Sell"].push("No Do Not Sell mentioned")
    }
    if (information["delete information"].length===0){
        information["delete information"].push("No CCPA delete my information mentioned ")
    }
    if (information["Opt-out/in"].length===0){
        information["Opt-out/in"].push("No opt out/in mentioned")
    }
    if (information["Privacy Policy"].length===0){
        information["Privacy Policy"].push("No privacy policy")
    }
    if (information["CCPA-only"].length===0){
        information["CCPA-only"].push("No CCPA mentioned")
    }
    return information
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
useOptOut();

// DB Fields
// Host, defaultDNS, supportGPC, supportDNS, have-set(local), DNS-text
function localDatabase(){
    // ...
}
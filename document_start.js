console.log("Hello");
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


function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}



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
        let jsonObj = JSON.parse(this.responseText)
        chrome.storage.sync.set({gpcKey: jsonObj.gpc}, function() {
            console.log('stored opt out info is: '+ jsonObj.gpc);
        })

    }
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.addEventListener("load", reqListener);
    xmlHttp.open( "GET", urlToObject, false ); // false for synchronous request
    xmlHttp.send();
}
GPCChecker();



function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}



// text searching part
// return1: [String1, String2, ...]
// return2 dictionary {topic: link}
function extracttextElements() {
    var elemTextList = [];
    var elems = document.getElementsByTagName("*");
    for (var i = 0; i < elems.length; i++) {
        elemTextList.push([elems[i].textContent, elems[i].tagName, elems[i].href, elems[i].id])
    }
    return elemTextList
}

//get required information
function filterResult(result) {
    var information = {};
    information["Do Not Sell"] = [];
    information["CCPA-delete"] = [];
    information["Opt-out/in"] = [];
    information["Privacy Policy"] = [];
    information["CCPA-only"] = [];
    const text1 = /do not sell|do not share|do not collect/ig
    const text2 = /CCPA.*delete|delete my information|delete-my-information/ig
    const text3 = /opt out|opt in|opt-in|opt-out/ig
    const text4 = /privacy policy|privacy-policy/ig
    const text5 = /CCPA|California Comsumer Privacy Act/ig
    //const text5=/data collection/ig

    var count = result.length;
    for (var i = 0; i < count; i++) {
        var item = result[i];
        if (typeof item[0] !== "undefined" && (typeof item[2] !== "undefined" || item[1] === 'BUTTON')) {
            if (item[0].match(text1)) {
                information["Do Not Sell"].push([item[0], item[1], item[2], item[3]])
            } else if (item[0].match(text2)) {
                information["CCPA-delete"].push([item[0], item[1], item[2], item[3]])
            } else if (item[0].match(text3)) {
                information["Opt-out/in"].push([item[0], item[1], item[2], item[3]])
            } else if (item[0].match(text4)) {
                information["Privacy Policy"].push([item[0], item[1], item[2], item[3]])
            } else if (item[0].match(text5)) {
                information["CCPA-only"].push([item[0], item[1], item[2], item[3]])
            }
        }
    }
    return information
}


function generate_json() {
    // var host = window.location.host;
    var attr_list = ["ccpa_do_not_sell", "ccpa_delete", "ccpa_opt_out_in", "ccpa_privacy_policy", "ccpa_copy"];
    var right_type_list = ["CCPADoNotSell", "CCPADelete", "CCPAOpOutIn", "CCPAPrivacyPolicy", "CCPACopy"];
    var info_list = ["Do Not Sell", "CCPA-delete", "Opt-out/in", "Privacy Policy", "CCPA-only"];

    function update(i, key_word_element) {
        var type = attr_list[i];
        dict_one_host[type]["text"] = key_word_element[0]; // "Delete my data"
        dict_one_host[type]["category"] = key_word_element[1]; // "input"
        if (key_word_element[1] === "A" | key_word_element[1] === "BUTTON" || key_word_element[1] === "input") {
            dict_one_host[type]["operation_type"] = "click"; // "click"
        } else {
            dict_one_host[type]["operation_type"] = "text"; // todo
        }
        dict_one_host[type]["url"] = key_word_element[2];
        dict_one_host[type]["html_id"] = key_word_element[3];
    }

    var dict_one_host = {};
    var result = extracttextElements();
    var all_key_word = filterResult(result);

    for (let i = 0; i < 5; i++) {
        if (all_key_word[info_list[i]].length > 0) {
            dict_one_host[attr_list[i]] = {};
            dict_one_host[attr_list[i]]["right_type"] = right_type_list[i];
            // for (const key_word_element of all_key_word[info_list[i]]) {
            key_word_element=all_key_word[info_list[i]][0];
            update(i, key_word_element);
            //     break;
            // }
        }
    }
    console.log("~~~\n\n\n\n");
    console.log(dict_one_host);
    return dict_one_host;
}




// elemObject: JSON of data gathered from host site (dict_one_host)
async function useOptOut(JSONDict){
    await sleep(5000);
    if(JSONDict["ccpa_do_not_sell"] != undefined){
        let doNotSellURL = JSONDict["ccpa_do_not_sell"]["url"];
        return doNotSellURL;
    }
    else if (JSONDict["ccpa_privacy_policy"] != undefined){
        let privPolURL = JSONDict["ccpa_privacy_policy"]["url"];
        return privPolURL;
    }
    else {
        return null;
    }
}



async function delayedGreeting() {
    await sleep(2000);
    let dict_one_host = generate_json();
    return useOptOut(dict_one_host);

}
delayedGreeting().then(function(result){
    chrome.storage.sync.set({optOutKey: result}, function() {
        console.log('stored opt out info is: '+ result);
    })
});

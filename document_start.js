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
    var reqJSON = JSON.stringify(req)
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
        if(this.status == 404){
            console.log("gpc not detected");
            return;
        }
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

var info_list = ["Do Not Sell", "delete information", "Opt-out/in", "Privacy Policy", "CCPA-only"];

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
    // const text4=/privacy policy|privacy-policy|privacy-notice|privacy_policy|privacy_notice|privacy notice|privacy.*a>|<.*a.*privacy/ig
    const text4=/privacy policy|privacy-policy|privacy-notice|privacy_policy|privacy_notice|privacy notice|privacy.*a>|<.*a.*privacy/ig
    const text5=/CCPA|California Comsumer Privacy Act|Califormia-Consumer-Privacy-Act/ig
    const text6=/privacy/ig
    var text_list=[text1,text2,text3,text4,text5,text6];
    var count = result.length;
    for (var i = 0; i < count; i++) {
        var item = result[i];
        if (typeof item[0] !== "undefined") {
            var know = false;
            for (var j = 0; j < 4; j++) {
                if (item[0].match(text_list[j])) {
                    information[info_list[j]].push([item[0], item[1], item[2], item[3]]);
                    know = true;
                    break;
                }
            }
            if (!know) {
                if (typeof item[2] !== "undefined") {
                    if (item[2].match(text6)) {
                        information["Privacy Policy"].push([item[0], item[1], item[2], item[3]]);
                    }
                } else if (item[0].match(text5)) {
                    information["CCPA-only"].push([item[0], item[1], item[2], item[3]]);
                }
            }
        }
    }
    return information
}


function generate_json() {
    function update(i, key_word_element) {
        var type = info_list[i];
        dict_one_host[type]["text"] = key_word_element[0]; // "Delete my data"
        dict_one_host[type]["category"] = key_word_element[1]; // "input"
        if (key_word_element[1] === "A" || key_word_element[1] === "BUTTON" || key_word_element[1] === "input") {
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
    console.log("all_key_word~~~\n\n\n\n",all_key_word,"\n\n\n\n");

    for (let i = 0; i < info_list.length; i++) {
        if (all_key_word[info_list[i]].length > 0) {
            dict_one_host[info_list[i]] = {};
            dict_one_host[info_list[i]]["right_type"] = info_list[i];
            // for (const key_word_element of all_key_word[info_list[i]]) {
            var key_word_element=all_key_word[info_list[i]][0];
            update(i, key_word_element);
            //     break;
            // }
        }
    }
    console.log("dict_one_host~~~\n\n\n\n",dict_one_host,"\n\n\n\n");
    return dict_one_host;
}





// elemObject: JSON of data gathered from host site (dict_one_host)
function useOptOut(JSONDict){
    //await sleep(5000);
    //const text=/http/ig
    if(JSONDict[info_list[0]]!== undefined && JSONDict[info_list[0]]["url"]!== undefined){
        if (JSONDict[info_list[0]]["url"]!== "o"){
            let doNotSellURL = JSONDict[info_list[0]]["url"];
            console.log("doNotSellURL~~~\n\n\n\n",doNotSellURL,"\n\n\n\n");
            return doNotSellURL;
        }
    }
    else if(JSONDict[info_list[3]]!== undefined && JSONDict[info_list[3]]["url"]!== undefined){
        if (JSONDict[info_list[3]]["url"]!== "o"){
            let privPolURL = JSONDict[info_list[3]]["url"];
            console.log("privPolURL~~~\n\n\n\n",privPolURL,"\n\n\n\n");
            return privPolURL;
        }
    }
    else {
        return null;
    }
}




async function delayedGreeting() {
    await sleep(2000);
    // Retrieving data:
    let text = localStorage.getItem("testJSON");
    let obj = Object();
    console.log("start text~~~\n\n\n\n",text,"\n\n\n\n");
    if (text!==null) {
        obj = JSON.parse(text);
    }
    let hostName = window.location.hostname;
    if (!("hostName" in obj) || obj["hostName"]===null) {
        let dict_one_host = generate_json();
        let url_ = useOptOut(dict_one_host);
        console.log("in if: url_~~~\n\n\n\n",url_,"\n\n\n\n");
        obj[hostName]=url_;
        console.log("in if: map~~~\n\n\n\n",obj,"\n\n\n\n");
    }
    console.log("out obj: map~~~\n\n\n\n",obj,"\n\n\n\n");
    // Storing data:
    // const myObj = {name: "John", age: 31, city: "New York"};
    // file=fopen('file.json',0);
    const myJSON = JSON.stringify(obj);
    console.log("myJSON~~~\n\n\n\n",myJSON,"\n\n\n\n");
    localStorage.setItem("testJSON", myJSON);
    // const FileSystem = require("fs");
    // FileSystem.writeFile('file.json', JSON.stringify(obj), (error) => {
    //     if (error) throw error;
    // });
}

delayedGreeting().then(function(){
    let text0 = localStorage.getItem("testJSON");
    console.log("text0~~~\n\n\n\n",text0,"\n\n\n\n");
    let obj0 = JSON.parse(text0);
    // let obj0={};
    // require('fs').readFile('file.json', (err, data) => {
    //     console.log(obj0);
    // })
    chrome.storage.sync.set({map: obj0}, function() {
        console.log('stored opt out info is: ');
        console.log("obj0~~~\n\n\n\n",obj0,"\n\n\n\n");
    })
});


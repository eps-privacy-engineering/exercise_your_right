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

function testParser(respJSON){
    console.log("test parser")
    console.log(respJSON)
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

var info_list = ["ccpa_do_not_sell", "ccpa_delete", "Opt-out/in", "Privacy Policy", "CCPA-only"];
var right_type_list = ["CCPADoNotSell", "CCPADelete", "CCPAOpOutIn", "CCPAPrivacyPolicy", "CCPACopy"];
//get required information
function filterResult(result){
    var information=new Object();
    information["ccpa_do_not_sell"]=[];
    information["ccpa_delete"]=[];
    information["Opt-out/in"]=[];
    information["Privacy Policy"]=[];
    information["CCPA-only"]=[];
    const text1=/do not sell|do not share|do not collect|do-not-sell|do_not_sell|do-not-share|do_not_share|do-not-collect|do_not_collect/ig
    const text2=/CCPA.*delete|delete my data|delete-my-data|delete_my_data |remove my data|remove-my-data|remove_my_data|remove personal info|remove-personal-info|remove_personal_info|delete my info|delete-my-info|delete_my_info|remove my info|remove-my-info|remove_my_info|remove your info|remove-your-info|remove_your_info/ig
    const text3=/opt out|opt in|opt-in|opt-out|opt_out|opt_in|optin|optout/ig
    const text4=/privacy policy|privacy-policy|privacy-notice|privacy_policy|privacy_notice|privacy notice|privacy.*a>|<.*a.*privacy/ig
    const text5=/CCPA|California Comsumer Privacy Act|Califormia-Consumer-Privacy-Act/ig
    const text6=/privacy/ig

    var count = result.length;
    for(var i = 0; i < count; i++) {
        var item = result[i];
        if (typeof item[0] !== "undefined")
        {

          if (item[0].match(text1))
            {
                information["Do Not Sell"].push( [item[1], item[2], item[3],item[0]])
            }
          else if (item[0].match(text2))
            {
                information["delete information"].push([item[1], item[2], item[3],item[0]])
            }
          else if (item[0].match(text3))
            {
                information["Opt-out/in"].push([item[1], item[2], item[3],item[0]])
            }
          else if (item[0].match(text4))
            {
                information["Privacy Policy"].push([item[1], item[2], item[3],item[0]])
            }
          else if (typeof item[2] !== "undefined")
            {
              if (item[2].match(text6))
                {
                information["Privacy Policy"].push([item[1], item[2], item[3],item[0]])
                }
            }
          else if (item[0].match(text5))
            {
                information["CCPA-only"].push([item[1], item[2], item[3],item[0]])
            }
     }
    }
    return information
}

function generate_json() {
    function update(i, key_word_element) {
//        var type = info_list[i];
//        dict_one_host[type]["text"] = key_word_element[0]; // "Delete my data"
//        dict_one_host[type]["category"] = key_word_element[1]; // "input"
//        if (key_word_element[1] === "A" || key_word_element[1] === "BUTTON" || key_word_element[1] === "input") {
//            dict_one_host[type]["operation_type"] = "click"; // "click"
//        } else {
//            dict_one_host[type]["operation_type"] = "text"; // todo
//        }
//        dict_one_host[type]["url"] = key_word_element[2];
//        dict_one_host[type]["html_id"] = key_word_element[3];

        node1 = new Object()
        node1.text = key_word_element[0]
        node1.category = key_word_element[1]
        if (key_word_element[1] === "A" || key_word_element[1] === "BUTTON" || key_word_element[1] === "input") {
           node1.operation_type = "click"// "click"
        }
//        else {
//            node1.operation_type = "text"; // todo
//        }
        node1.url = key_word_element[2];
        node1.html_id = key_word_element[3];
        return node1;
    }

    var dict_one_host = {};
    var result = extracttextElements();
    var all_key_word = filterResult(result);
    console.log("all_key_word~~~\n\n\n\n",all_key_word,"\n\n\n\n");

    for (let i = 0; i < info_list.length; i++) {
        if (all_key_word[info_list[i]].length > 0) {
            dict_one_host[info_list[i]] = {};
            dict_one_host[info_list[i]]["right_type"] = right_type_list[i];
            // for (const key_word_element of all_key_word[info_list[i]]) {
            var key_word_element=all_key_word[info_list[i]][0];
            var node1 = update(i, key_word_element);
            if (node1.operation_type == "click"){
                dict_one_host[info_list[i]].exercise_path = new Array()
                dict_one_host[info_list[i]].exercise_path.push(node1);
                 break;
            }
        }
    }
//    if (node1.operation_type == "click"){
//                dict_one_host[info_list[i]].exercise_path = new Array()
//                dict_one_host[info_list[i]].exercise_path.push(node1);
//                 break;
//             }
    console.log("dict_one_host~~~\n\n\n\n",dict_one_host,"\n\n\n\n");
    return dict_one_host;
}


//detail = new Object()
//detail.right_type = "CCPADelete"
//detail.exercise_path = new Array()
//node1 = new Object()
//node1.text = "Privacy Policies"
//node1.category = "input"
//node1.operation_type = "click"
//node1.html_id = "a7"
//detail.exercise_path.push(node1)
//
//console.log("detail",detail)


// elemObject: JSON of data gathered from host site (dict_one_host)
function useOptOut(JSONDict){
    //await sleep(5000);
    //const text=/http/ig
    if(JSONDict[info_list[0]]!== undefined && JSONDict[info_list[0]].exercise_path[0]["url"]!== undefined){
        if (JSONDict[info_list[0]].exercise_path[0]["url"]!== "o"){
            let doNotSellURL = JSONDict[info_list[0]].exercise_path[0]["url"];
            console.log("doNotSellURL~~~\n\n\n\n",doNotSellURL,"\n\n\n\n");
            return doNotSellURL;
        }
    }
    else if(JSONDict[info_list[3]]!== undefined && JSONDict[info_list[3]].exercise_path[0]["url"]!== undefined){
        if (JSONDict[info_list[3]].exercise_path[0]["url"]!== "o"){
            let privPolURL = JSONDict[info_list[3]].exercise_path[0]["url"];
            console.log("privPolURL~~~\n\n\n\n",privPolURL,"\n\n\n\n");
            return privPolURL;
        }
    }
    else {
        return null;
    }
}



function get_and_update(respJSON){
    console.log("get_and_update")
    console.log(respJSON)
    let obj = new Object();
    obj = JSON.parse(respJSON);
    console.log("respJSON.ccpa",respJSON.ccpa);

    console.log("1",respJSON.ccpa)
    console.log("2",obj.ccpa)
    console.log("3",obj["ccpa"])
    console.log("3", (respJSON.ccpa === undefined))
    if (respJSON.ccpa === undefined) {
        let dict_one_host = generate_json();
        for ([key, value] of Object.entries(dict_one_host)) {
            console.log(key, value);
            req_update = new Object()
            req_update.host = window.location.hostname;
            req_update.exercise_detail=value;
            console.log("value",value);
            sendhttpPOST("http://127.0.0.1:8080/update_website_attr",testParser,req_update)
         }
    }
    else {
        console.log("respJSON.ccpa!==null");
    }
    console.log("get_and_update end")

    req_get = new Object()
    req_get.host=window.location.hostname;
    console.log("delayedGreeting.then() before sendhttpPOST");
    sendhttpPOST("http://127.0.0.1:8080/get_website_attr",get_url,req_get);
    console.log("delayedGreeting.then() after sendhttpPOST");
}
async function delayedGreeting() {
    await sleep(2000);
    // Retrieving data:
    req_get = new Object()
    req_get.host=window.location.hostname;
    console.log("delayedGreeting before sendhttpPOST");
    sendhttpPOST("http://127.0.0.1:8080/get_website_attr",get_and_update,req_get); // todo 1.13.20.181
    console.log("delayedGreeting after sendhttpPOST");
}

async function get_url(respJSON){
    console.log("get_url")
    console.log(respJSON)
    let obj = new Object();
    obj = JSON.parse(respJSON);

    console.log("1",respJSON.ccpa)
    console.log("2",obj.ccpa)
    console.log("3",obj["ccpa"])
    console.log("3", (respJSON.ccpa === undefined))
    if (obj.ccpa)  {
        console.log("@@respJSON.ccpa",obj.ccpa)
        let url_ = useOptOut(obj.ccpa);
//        console.log("in if: url_~~~\n\n\n\n",url_,"\n\n\n\n");
        chrome.storage.sync.set({url: url_}, function() {
            console.log('stored opt out info is: ');
            console.log("obj0~~~\n\n\n\n",url_,"\n\n\n\n");
        })
    } else {
        console.log("something wrong!");
    }

    console.log("get_url end")
}
delayedGreeting().then(function(){

});


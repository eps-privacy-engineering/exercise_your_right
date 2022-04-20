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


function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

function testParser(respJSON) {
    console.log("test parser")
    console.log(respJSON)
}

//GPC Checker: currently, I think this should work for any site listed on https://well-known.dev/?q=resource:%22gpc%22#results.
// https://developer.mozilla.org/en-US/docs/Web/API/Window/location
// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest
function GPCChecker() {
    let currentUrl = location.href;
    console.log(currentUrl);
    let wellKnownObject = ".well-known/gpc.json";
    let urlToObject = currentUrl + wellKnownObject;
    console.log(urlToObject);

    function reqListener() {
        if (this.status == 404) {
            console.log("gpc not detected");
            return;
        }
        console.log(this.responseText);
        let jsonObj = JSON.parse(this.responseText)
        chrome.storage.sync.set({gpcKey: jsonObj.gpc}, function () {
            console.log('stored opt out info is: ' + jsonObj.gpc);
        })
    }

    var xmlHttp = new XMLHttpRequest();
    xmlHttp.addEventListener("load", reqListener);
    xmlHttp.open("GET", urlToObject, false); // false for synchronous request
    xmlHttp.send();
}

GPCChecker();


function sleep(ms) {
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
function filterResult(result) {
    var information = new Object();
    information["ccpa_do_not_sell"] = [];
    information["ccpa_delete"] = [];
    information["Opt-out/in"] = [];
    information["Privacy Policy"] = [];
    information["CCPA-only"] = [];
    const text1 = /do not sell|do not share|do not collect|do-not-sell|do_not_sell|do-not-share|do_not_share|do-not-collect|do_not_collect/ig
    const text2 = /CCPA.*delete|delete my data|delete-my-data|delete_my_data |remove my data|remove-my-data|remove_my_data|remove personal info|remove-personal-info|remove_personal_info|delete my info|delete-my-info|delete_my_info|remove my info|remove-my-info|remove_my_info|remove your info|remove-your-info|remove_your_info/ig
    const text3 = /opt out|opt in|opt-in|opt-out|opt_out|opt_in|optin|optout/ig
    const text4 = /privacy policy|privacy-policy|privacy-notice|privacy_policy|privacy_notice|privacy notice|privacy.*a>|<.*a.*privacy/ig
    const text5 = /CCPA|California Comsumer Privacy Act|Califormia-Consumer-Privacy-Act/ig
    const text6 = /privacy/ig

    var count = result.length;
    for(var i = 0; i < count; i++) {
        var item = result[i];
        if (typeof item[0] !== "undefined") {

            if (item[0].match(text1)) {
//            elemTextList.push([elems[i].textContent, elems[i].tagName, elems[i].href, elems[i].id])
                information["ccpa_do_not_sell"].push([item[1], item[2], item[3], item[0]])
            } else if (item[0].match(text2)) {
                information["ccpa_delete"].push([item[1], item[2], item[3], item[0]])
            } else if (item[0].match(text3)) {
                information["Opt-out/in"].push([item[1], item[2], item[3], item[0]])
            } else if (item[0].match(text4)) {
                information["Privacy Policy"].push([item[1], item[2], item[3], item[0]])
            } else if (typeof item[2] !== "undefined") {
                if (item[2].match(text6)) {
                    information["Privacy Policy"].push([item[1], item[2], item[3], item[0]])
                }
            } else if (item[0].match(text5)) {
                information["CCPA-only"].push([item[1], item[2], item[3], item[0]])
            }
        }
    }
    return information
}

function generate_json() {
    function update(i, key_word_element) {
        node1 = new Object()
        var tagname = key_word_element[0]
        var href = key_word_element[1]
        var id = key_word_element[2]
        if (tagname === "A" || tagname === "BUTTON" || tagname === "input") {
            node1.operation_type = "click"// "click"
            console.log("333");
        } else {
            node1.operation_type = "text"; // todo
        }
        console.log("222");
        var text = key_word_element[3]
        node1.page = href
        node1.text = text
        node1.category = tagname
        node1.html_id = id
        return node1;
    }


    var dict_one_host = {};
    var result = extracttextElements();
    var all_key_word = filterResult(result);
    console.log("all_key_word~~~\n\n\n\n", all_key_word, "\n\n\n\n");

    for (let i = 0; i < info_list.length; i++) {
        if (all_key_word[info_list[i]].length > 0) {
            console.log(right_type_list[i], "111");
            var node1;
            for (const key_word_element of all_key_word[info_list[i]]) {
//            var key_word_element=all_key_word[info_list[i]][0];
                node1 = update(i, key_word_element);
                if (node1.operation_type && node1.operation_type === "click") {
                    break;
                }
            }

            if (node1.operation_type && node1.operation_type === "click") {
                console.log(info_list[i], "is click");
                if (dict_one_host[info_list[i]] == null) {
                    dict_one_host[info_list[i]] = {};
                    dict_one_host[info_list[i]]["right_type"] = right_type_list[i];
                }
                if (dict_one_host[info_list[i]]["exercise_path"] == null) {
                    dict_one_host[info_list[i]]["exercise_path"] = new Array();
                }
                dict_one_host[info_list[i]]["exercise_path"].push(node1);
            }

        }
    }
    console.log("dict_one_host~~~\n\n\n\n", dict_one_host, "\n\n\n\n");
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
function useOptOut(JSONDict) {
    //await sleep(5000);
    //const text=/http/ig
    if (JSONDict[info_list[0]] !== undefined && JSONDict[info_list[0]].exercise_path[0]["page"] !== undefined) {
        if (JSONDict[info_list[0]].exercise_path[0]["page"] !== "o") {
            let doNotSellURL = JSONDict[info_list[0]].exercise_path[0]["page"];
            console.log("doNotSellURL~~~\n\n\n\n", doNotSellURL, "\n\n\n\n");
            return doNotSellURL;
        }
    } else if (JSONDict[info_list[3]] !== undefined && JSONDict[info_list[3]].exercise_path[0]["page"] !== undefined) {
        if (JSONDict[info_list[3]].exercise_path[0]["page"] !== "o") {
            let privPolURL = JSONDict[info_list[3]].exercise_path[0]["page"];
            console.log("privPolURL~~~\n\n\n\n", privPolURL, "\n\n\n\n");
            return privPolURL;
        }
    } else {
        return null;
    }
}

function exist(obj) {
    var path_vec = obj.ccpa.ccpa_do_not_sell.exercise_path;
    var node = path_vec[path_vec.length - 1];
    if (node) {
        console.log("node: ", node.page);
    } else {
        console.log("no node");
    }

    // var current_url = ;

    // whether current_url is in the path
    var in_path = true;


    if (in_path) {

    }


}


function get_and_update(respJSON) {
    console.log("get_and_update")
    console.log(respJSON)
    let obj = new Object();
    obj = JSON.parse(respJSON);
    console.log("respJSON.ccpa", obj.ccpa);

    console.log("3", (obj.ccpa === undefined))
    if (obj.ccpa === null) {
        let dict_one_host = generate_json();
        for ([key, value] of Object.entries(dict_one_host)) {
            console.log(key, value);
            req_update = new Object()
            req_update.host = window.location.hostname;
            req_update.exercise_detail = value;
            console.log("value", value);
            sendhttpPOST("http://127.0.0.1:80/update_website_attr", testParser, req_update)
        }
    } else {
        console.log("obj.ccpa!==null");
        exist(obj); //  todo return url to @jack
    }
    console.log("get_and_update end")

    req_get = new Object()
    req_get.host = window.location.hostname;
    console.log("delayedGreeting.then() before sendhttpPOST");
    sendhttpPOST("http://127.0.0.1:80/get_website_attr", get_url, req_get);
    console.log("delayedGreeting.then() after sendhttpPOST");
}


async function delayedGreeting() {
    await sleep(2000);
    // Retrieving data:
    req_get = new Object()
    req_get.host = window.location.hostname;
    console.log("~~", req_get);
    console.log("delayedGreeting before sendhttpPOST");
    sendhttpPOST("http://127.0.0.1:80/get_website_attr", get_and_update, req_get); // todo 1.13.20.181
    console.log("delayedGreeting after sendhttpPOST");
}

async function get_url(respJSON) {
    console.log("get_url")
    console.log(respJSON)
    let obj = new Object();
    obj = JSON.parse(respJSON);

    console.log("1", respJSON.ccpa)
    console.log("2", obj.ccpa)
    console.log("3", obj["ccpa"])
    console.log("3", (respJSON.ccpa === undefined))
    if (obj.ccpa) {
        console.log("@@respJSON.ccpa", obj.ccpa)
        let url_ = useOptOut(obj.ccpa);
//        console.log("in if: url_~~~\n\n\n\n",url_,"\n\n\n\n");
        chrome.storage.sync.set({url: url_}, function () {
            console.log('stored opt out info is: ');
            console.log("obj0~~~\n\n\n\n", url_, "\n\n\n\n");
        })
    } else {
        console.log("something wrong!");
    }

    console.log("get_url end")
}

delayedGreeting().then(function () {

});


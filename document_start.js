console.log("Hello");
const script = document.createElement('script');
script.innerHTML = 'Object.defineProperty(navigator, \'globalPrivacyControl\', {get: () => true, set: (v) => {}});';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);


function sendhttpPOST(url, parsefunc, req) {
    // var value;
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
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
        if (this.status === 404) {
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
    for (var i = 0; i < count; i++) {
        var item = result[i];
        if (typeof item[0] !== "undefined") {
            // elemTextList.push([elems[i].textContent, elems[i].tagName, elems[i].href, elems[i].id])
            if (item[0].match(text1)) {
                information["ccpa_do_not_sell"].push([item[1], item[2], item[3], item[0]])
            } else if (item[0].match(text2)) {
                information["ccpa_delete"].push([item[1], item[2], item[3], item[0]])
            } else if (item[0].match(text3)) {
                information["Opt-out/in"].push([item[1], item[2], item[3], item[0]])
            } else if (item[0].match(text4)) {
                information["Privacy Policy"].push([item[1], item[2], item[3], item[0]])
            } else if (typeof item[2] !== "undefined") {
                if (item[1] !== "use") {
                    console.log("item[2]:", item[2]);
                    if (item[2].match(text6)) {
                        information["Privacy Policy"].push([item[1], item[2], item[3], item[0]])
                    }
                }
            } else if (item[0].match(text5)) {
                information["CCPA-only"].push([item[1], item[2], item[3], item[0]])
            }
        }
    }
    return information
}

function generate_json(obj, create_new, all_key_word) {
    for (let i = 0; i < info_list.length; i++) {
        if (all_key_word[info_list[i]].length > 0) {
            generate_json_attribure(i, obj, create_new, all_key_word)
        }
    }
}

// bool create_new,
// if yes, I would create a new dict to let database replace the current one
// if no,
//     if obj.ccpa.attr exists, then extend a node in exercise_path
//     else create new
function generate_json_attribure(i, obj, create_new, all_key_word) {
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
        node1.page = window.location.hostname + window.location.pathname
        node1.text = text
        node1.category = tagname
        if (href) {
            node1.html_id = href
        } else {
            node1.html_id = id
        }
        return node1;
    }

    console.log(right_type_list[i], "111");
    var node1;
    attr = info_list[i];
    for (const key_word_element of all_key_word[attr]) {
        // var key_word_element=all_key_word[attr][0];
        node1 = update(i, key_word_element);
        if (node1.operation_type && node1.operation_type === "click") {
            break;
        }
    }

    if (node1 && node1.operation_type && node1.operation_type === "click") {
        console.log(attr, "is click");

        dict = {};
        dict["right_type"] = right_type_list[i];
        console.log("create_new:", create_new);
        console.log("obj.ccpa :", obj.ccpa);
        console.log("judge :", (!create_new && obj.ccpa && obj.ccpa[attr]));
        console.log("judge :", (!create_new && obj.ccpa));
        console.log("judge :", (obj.ccpa && obj.ccpa[attr]));
        if (!create_new && obj.ccpa && obj.ccpa[attr]) {
            dict = obj.ccpa[attr];
            console.log("just extend, previous dict:", dict);
        }
        // if (obj.ccpa && obj.ccpa.attr) {
        //     dict = obj.ccpa.attr;
        //     console.log("just extend, previous dict:", dict);
        // }
        // if (create_new){
        //     dict = {};
        // }

        if (dict["exercise_path"] == null) {
            console.log("create new path", dict);
            dict["exercise_path"] = new Array();
        }
        dict["exercise_path"].push(node1);

        req_update = new Object()
        req_update.host = window.location.hostname;
        req_update.exercise_detail = dict;
        console.log("dict", dict);
        sendhttpPOST("http://127.0.0.1:80/update_website_attr", testParser, req_update)
    }
}


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

function exist_prev_version(obj, all_key_word) {
    var arr = exist(obj);
    console.log("arr: ", arr);
    for (let i = 0; i < info_list.length; i++) {
        console.log("info - arr: ", info_list[i], arr[i]);
        if (arr[i] === -1 || arr[i] === 1) {
        } else if (arr[i] === 0) {
            generate_json_attribure(i, obj, 0, all_key_word);
        } else if (arr[i] === 2) {
            generate_json_attribure(i, obj, 1, all_key_word);
        }
    }
}

function exist_notes(obj, all_key_word) {
    // // if node already in the path
    // var current_url = window.location.hostname + window.location.pathname
    // for (const node of dict["exercise_path"]) {
    //     if (current_url===node.page){
    //         return;
    //     }
    // }
    // var path_vec = obj.ccpa.ccpa_do_not_sell.exercise_path;
    // var node = path_vec[path_vec.length - 1];
    // if (node) {
    //     console.log("node: ", node.page);
    // } else {
    //     console.log("no node");
    // }
    // // 判断有没有锁
    //
    // // var current_url = ;
    //
    // // whether current_url is in the path
    // var in_path = true;
    //
    //
    // if (in_path) {
    //     // if there is current_url->next
    //     // if yes, do nothing; just return
    //     // if no, update
    // } else {
    //     // create
    // }
}

// TODO @Joy:
// arr[i]==-1 locked
// arr[i]==0 last node in the list, append
// arr[i] == 1 not the last, follow the list
// arr[i]==2 hard fork, overwrite
function exist(obj) {
    console.log("obj is ",obj);
    var arr = new Array(info_list.length)
    for (let i = 0; i < info_list.length; i++) {
        arr[i] = 2;
        var infoname = info_list[i];
        console.log("pathvec " + info_list[i] + " " + obj.ccpa[infoname]);
        var right_obj = obj.ccpa[infoname];
        if (right_obj === undefined || right_obj==null) {
            continue;
        }
        var path_vec = obj.ccpa[infoname].exercise_path;
        console.log("path_vec is ",path_vec)
        var lastNode = path_vec[path_vec.length - 1];
        if (lastNode) {
            console.log("node: ", lastNode.page);
        } else {
            console.log("no node");
        }
        if (right_obj.finish) {
            // locked, return it
            arr[i] = -1;
            continue;
        }
        var current_url = window.location.hostname + window.location.pathname;
        // whether current_url is in the path
        for (var j = 0; j < path_vec.length; j++) {
            if (path_vec[j].page === window.location.hostname + window.location.pathname) { // todo
                if (j === path_vec.length - 1) { // todo
                    // this is the last, append
                    arr[i] = 0;
                    break;
                } else {
                    // not the last, follow
                    arr[i] = 1;
                    break;
                }
            }
        }
    }
    return arr;
}

function get_and_update(respJSON) {
    console.log("get_and_update")
    console.log(respJSON)
    let obj = new Object();
    obj = JSON.parse(respJSON);
    console.log("### just get obj.ccpa", obj.ccpa);

    console.log("3", (obj.ccpa === undefined))

    var result = extracttextElements();
    var all_key_word = filterResult(result);
    console.log("all_key_word~~~\n\n\n\n", all_key_word, "\n\n\n\n");

    if (obj.ccpa === null) {
        generate_json(obj, 1, all_key_word);
    } else {
        console.log("obj.ccpa!==null");
        exist_prev_version(obj, all_key_word); //  todo return url to @jack
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
        // console.log("in if: url_~~~\n\n\n\n",url_,"\n\n\n\n");
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


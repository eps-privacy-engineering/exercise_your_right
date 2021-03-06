window.onload = function () {
    chrome.storage.sync.get(['gpcKey'], function (result) {
        console.log('GPC value currently is ' + result.gpcKey);
        document.getElementById("gpc-received").append(result.gpcKey);
    });

    var info_list = ["ccpa_do_not_sell", "ccpa_delete", "ccpa_privacy_policy"];
    var right_type_list = ["Do Not Sell", "Delete", "Privacy Policy"];
    var finish_list = ["ccpa_finish_do_not_sell", "ccpa_finish_delete", "ccpa_finish_privacy_policy"];
    var backend_right_type_list = ["CCPADoNotSell", "CCPADelete", "CCPAPrivacyPolicy"];

    var dict={"ccpa_do_not_sell": false, "ccpa_delete": false, "ccpa_privacy_policy": false};
    function defaultParser(respJSON) {

	}

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

    for (let i = 0; i < info_list.length; i++) {
        is_available();
// elemObject: JSON of data gathered from host site (dict_one_host)
        function useOptOut2(JSONDict) {
            //await sleep(5000);
            //const text=/http/ig
            console.log("JSONDict:", JSONDict);
            var return_dict = {};
            for (let i = 0; i < info_list.length; i++) {
                var infoname = info_list[i];
                console.log("infoname", infoname, JSONDict[infoname]);
                var right_obj = JSONDict[infoname];
                if (right_obj !== undefined && right_obj) {
                    var path_list = right_obj.exercise_path
                    console.log("path_list", path_list);
                    if (path_list !== undefined && path_list !== null && path_list.length > 0) {
                        console.log("in path list", infoname);
                        var lastNode = path_list[path_list.length - 1]["html_id"];
                        if (lastNode && lastNode !== "o") {
                            let url = lastNode;
                            console.log("infoname with url in useOptOut2", infoname, url);
                            return_dict[infoname] = url;
                        }
                    }
                }
            }
            console.log("return_dict:", return_dict);
            return return_dict;
        }

        async function get_url(respJSON) {
            console.log("get_url")
            console.log(respJSON)
            let obj = new Object();
            obj = JSON.parse(respJSON);

            console.log("1", obj.ccpa)
            if (obj.ccpa) {
                console.log("@@obj.ccpa", obj.ccpa)
                let url_dict_ = useOptOut2(obj.ccpa);
                console.log('url_dict_', url_dict_);
                var val = url_dict_[info_list[i]];
                console.log('info_list[i]', i, info_list[i]);
                console.log('val', val);
                if (val){
                    document.getElementById(info_list[i]).className = "updateButton";
                }
                dict[info_list[i]]=val;
            } else {
                console.log("something wrong!");
            }
            console.log("get_url end")
        }

        // function set_button_color(){
        //     window.onclick = function (){
        //
        //     }
        //     console.log(document.getElementById(info_list[i]).style.backgroundColor='90EE90FF');
        // }
        function is_available() {
            chrome.tabs.query(
                {
                    currentWindow: true,    // currently focused window
                    active: true            // selected tab
                },
                function (foundTabs) {
                    if (foundTabs.length > 0) {
                        var url_str = foundTabs[0].url;
                        let url_ = new URL(url_str);
                        console.log("url_", url_)
                        console.log("2", url_.hostname)
                        var req_get = new Object()
                        req_get.host = url_.hostname // window.location.hostname;
                        console.log("delayedGreeting.then() before sendhttpPOST");
                        sendhttpPOST("http://127.0.0.1:80/get_website_attr", get_url, req_get);
                        console.log("delayedGreeting.then() after sendhttpPOST");
                    }
                })
        }
    }
    for (let i = 0; i < info_list.length; i++) {
        document.getElementById(info_list[i]).onclick = function (){
            pop_up_url(dict[info_list[i]]);
            function pop_up_url(val) {
                console.log('in pop_up_url', val);
                if (val == null) {
                    const para = document.createElement('p');
                    para.innerHTML = "No " + right_type_list[i] + " available.";
                    document.body.appendChild(para);
                } else {
                    alert('Privacy url val is ' + val)
                    console.log('test href', val);
                    if (val.length > 8 && val.substring(0, 8) === "https://") {
                        window.open(val, "_blank");
                    } else if (val.length > 7 && val.substring(0, 7) === "http://") {
                        window.open(val, "_blank");
                    } else {
                        window.open("https://" + val, "_blank");
                    }
                }
            }
        }
    }
    for (let i = 0; i < finish_list.length; i++) {
        document.getElementById(finish_list[i]).onclick = function () {
            console.log(finish_list[i]);
            chrome.tabs.query(
                {
                    currentWindow: true,    // currently focused window
                    active: true            // selected tab
                },
                function (foundTabs) {
                    if (foundTabs.length > 0) {
                        var reqFinish = new Object();
                        var url_str = foundTabs[0].url;
                        let url_ = new URL(url_str);
                        reqFinish.host = url_.hostname;
                        reqFinish.right_type = backend_right_type_list[i];
                        sendhttpPOST("http://127.0.0.1:80/finish_path", defaultParser, reqFinish);
                    }
                })
        }
    }

    // for (let i = 0; i < info_list.length; i++) {
    //     document.getElementById(info_list[i]).onclick = function () {
    //         console.log(info_list[i]);
    //         chrome.tabs.query(
    //             {
    //                 currentWindow: true,    // currently focused window
    //                 active: true            // selected tab
    //             },
    //             function (foundTabs) {
    //                 if (foundTabs.length > 0) {
    //                     var nowPage = foundTabs[0].url;
    //                     console.log(foundTabs[0])
    //                     var url = new URL(nowPage)
    //                     // var keyName = url.hostname;
    //                     // alert("this key name in popup is " + keyName) // ok
    //                     chrome.storage.sync.get(['url_dict'], function (result) {
    //                         // alert('Privacy info value currently is ' + result.url_dict); // ok
    //                         var val = result.url_dict[info_list[i]];
    //                         pop_up_url(val);
    //
    //                     });
    //                 } else {
    //
    //                 }
    //             }
    //         );
    //     }
    // }
}

window.onload = function () {
    chrome.storage.sync.get(['gpcKey'], function (result) {
        console.log('GPC value currently is ' + result.gpcKey);
        document.getElementById("gpc-received").append(result.gpcKey);
    });

    var info_list = ["ccpa_do_not_sell", "ccpa_delete", "Opt-out/in", "ccpa_privacy_policy", "ccpa_copy"];
    var right_type_list = ["Do Not Sell", "Delete", "Opt Out In", "Privacy Policy", "Copy"];


    for (let i = 0; i < info_list.length; i++) {
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
                    if (path_list !== undefined && path_list.length > 0) {
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
                pop_up_url(val);
            } else {
                console.log("something wrong!");
            }

            console.log("get_url end")
        }

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

        document.getElementById(info_list[i]).onclick = function () {
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

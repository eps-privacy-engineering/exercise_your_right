window.onload = function () {
    chrome.storage.sync.get(['gpcKey'], function (result) {
        console.log('GPC value currently is ' + result.gpcKey);
        document.getElementById("gpc-received").append(result.gpcKey);
    });

    var info_list = ["ccpa_do_not_sell", "ccpa_delete", "Opt-out/in", "ccpa_privacy_policy", "ccpa_copy"];
    var right_type_list = ["Do Not Sell", "Delete", "Opt Out In", "Privacy Policy", "Copy"];

    for (let i = 0; i < info_list.length; i++) {
        document.getElementById(info_list[i]).onclick = function () {
            console.log(info_list[i]);
            chrome.tabs.query(
                {
                    currentWindow: true,    // currently focused window
                    active: true            // selected tab
                },
                function (foundTabs) {
                    if (foundTabs.length > 0) {
                        var nowPage = foundTabs[0].url;
                        console.log(foundTabs[0])
                        var url = new URL(nowPage)
                        // var keyName = url.hostname;
                        // alert("this key name in popup is " + keyName) // ok
                        chrome.storage.sync.get(['url_dict'], function (result) {
                            // alert('Privacy info value currently is ' + result.url_dict); // ok
                            var val = result.url_dict[info_list[i]];
                            if (val == null) {
                                const para = document.createElement('p');
                                para.innerHTML = "No " + right_type_list[i] + " available.";
                                document.body.appendChild(para);
                            } else {
                                alert('Privacy url val is ' + val)
                                console.log('test href', val);
                                if (val.length> 8 && val.substring(0,8) === "https://") {
                                    window.open(val, "_blank");
                                }
                                else if (val.length> 7 && val.substring(0,7) === "http://") {
                                    window.open(val, "_blank");
                                }
                                else {
                                    window.open("https://"+val, "_blank");
                                }
                            }

                        });
                    } else {

                    }
                }
            );
        }
    }
}

// "www.xfinity.com": {
//  "ccpa_do_not_sell": {
//   "right_type": "CCPA_Sell",
//   "exercise_path": [
//    {
//     "text": "Do Not Sell My Personal Information",
//     "category": "href",
//     "operation_type": "click"
//    }
//   ]
//  },
//  "ccpa_delete": null,
//  "ccpa_copy": null
// }


var host = window.location.host;

function update(type,key_word_element){
    dict_one_host[type]["text"]=""; // "Delete my data"
    dict_one_host[type]["category"]=""; // "input"
    dict_one_host[type]["operation_type"]=""; // "click"
    dict_one_host[type]["html_id"]=""; // "a9"
}
// GetWebsiteAttrRequest will give NULL if none.
var attr_list=["ccpa_do_not_sell","ccpa_delete","ccpa_copy","ccpa_privacy_policy"];
var right_type_list=["CCPADoNotSell","CCPADelete","CCPACopy","CCPAPrivacyPolicy"];


// this is ok, I commit it and make a copy just to check modification
// var dict_one_host=JSON.parse(GetWebsiteAttrRequest(host));
var dict_one_host_origin=JSON.parse(GetWebsiteAttrRequest(host));
var dict_one_host = Object.assign({}, dict_one_host_origin);

if (!(("ccpa_do_not_sell" in dict_one_host) && ("ccpa_delete" in dict_one_host) && ("ccpa_copy" in dict_one_host))) {
    // go to website to get attr
    all_key_word=filterResult_keyword(resultDict);

    for (let i = 0; i < 4; i++) {
        if (((!(attr_list[i] in dict_one_host) && (all_key_word[i].length > 0)))
            ||
            (dict_one_host[attr_list[i]]["exercise_path"].length < all_key_word[i].length)
        ) {
            dict_one_host[attr_list[i]]["right_type"] = right_type_list[i];
            for (const key_word_element of all_key_word[i]) {
                update(attr_list[i], key_word_element);
            }
        }
    }
    // if (((!("ccpa_do_not_sell" in dict_one_host) && (DNS_key_word.length > 0)))
    //     ||
    //     (dict_one_host["ccpa_do_not_sell"]["exercise_path"].length < DNS_key_word.length)
    // ) {
    //     dict_one_host["ccpa_do_not_sell"]["right_type"] = "CCPADoNotSell";
    //     for (const DNS_key_word_element of DNS_key_word) {
    //         update("ccpa_do_not_sell", DNS_key_word_element);
    //     }
    // }

    if (dict_one_host_origin===dict_one_host){
        console.log("\n\n\n\n\n !!! --- No change \n\n\n\n\n");
    }
    dict_one_host_json=JSON.stringify(dict_one_host);
    UpdateWebsiteAttrRequest(host,dict_one_host_json);

}

fetch_page(dict_one_host);

function extracttextElements(){
    var elemTextList=[];
    var dict = new Object();
    var  elems=document.getElementsByTagName("*");
    for(var i=0;i<elems.length;i++){
        
    elemTextList.push([elems[i].textContent,elems[i].tagName, elems[i].href,elems[i].id])
    }
    return elemTextList
}

//get required information
function filterResult(result){
    var information=new Object();
    information["Do Not Sell"]=[];
    information["CCPA-delete"]=[];
    information["Opt-out/in"]=[];
    information["Privacy Policy"]=[];
    information["CCPA-only"]=[];
    const text1=/do not sell|do not share|do not collect/ig
    const text2=/CCPA.*delete|delete my information|delete-my-information/ig
    const text3=/opt out|opt in|opt-in|opt-out/ig
    const text4=/privacy policy|privacy-policy/ig
    const text5=/CCPA|California Comsumer Privacy Act/ig
    //const text5=/data collection/ig
    
    var count = result.length;
    for(var i = 0; i < count; i++) {
        var item = result[i];
        if (typeof item[0] !== "undefined" && (typeof item[2] !== "undefined" || item[1]== 'BUTTON'))
        {
        
          if (item[0].match(text1))
            {
                information["Do Not Sell"].push( [item[0],item[1], item[2], item[3]])
            }
          else if (item[0].match(text2))
            {
                information["CCPA-delete"].push([item[0],item[1], item[2], item[3]])
            }
          else if (item[0].match(text3))
            {
                information["Opt-out/in"].push([item[0],item[1], item[2], item[3]])
            }
          else if (item[0].match(text4))
            {
                information["Privacy Policy"].push([item[0],item[1], item[2], item[3]])
            }
          else if (item[0].match(text5))
            {
                information["CCPA-only"].push([item[0],item[1], item[2], item[3]])
            }  
     }
    }
    return information
}


var host = window.location.host;

var attr_list=["ccpa_do_not_sell","ccpa_delete","ccpa_opt_out_in","ccpa_privacy_policy","ccpa_copy"];
var right_type_list=["CCPADoNotSell","CCPADelete","CCPAOpOutIn","CCPAPrivacyPolicy","CCPACopy"];
var info_list=["Do Not Sell", "CCPA-delete","Opt-out/in","Privacy Policy","CCPA-only"];

function update(i,key_word_element){
    var type=attr_list[i];
    dict_one_host[type]["text"]=key_word_element[0]; // "Delete my data"
    dict_one_host[type]["category"]=key_word_element[1]; // "input"
    if (key_word_element[1]=="A" | key_word_element[1]=="BUTTON" || key_word_element[1]=="input"){
        dict_one_host[type]["operation_type"]="click"; // "click"
    } 
    else {
        dict_one_host[type]["operation_type"]="text"; // todo
    }
    dict_one_host[type]["url"]=key_word_element[2]; 
    dict_one_host[type]["html_id"]=key_word_element[3]; 
}

var dict_one_host= {};
var result=extracttextElements();
var all_key_word=filterResult(result);
// all_key_word=filterResult_keyword(resultDict);

for (let i = 0; i < 5; i++) {
    if (all_key_word[info_list[i]].length > 0) {
        dict_one_host[attr_list[i]]={};
        dict_one_host[attr_list[i]]["right_type"] = right_type_list[i];
        for (const key_word_element of all_key_word[info_list[i]]) {
            update(i, key_word_element);
            break;
        }
    }
}
dict_one_host
// fetch_page(dict_one_host);



// ~~~~~~

// function extracttextElements(){
//     var elemTextList=[];
//     var dict = new Object();
//     var  elems=document.getElementsByTagName("*");
//     for(var i=0;i<elems.length;i++){
        
//     elemTextList.push([elems[i].textContent,elems[i].tagName, elems[i].href,elems[i].id])
//     }
//     return elemTextList
// }

// //get required information
// function filterResult(result){
//     var information=new Object();
//     information["Do Not Sell"]=[];
//     information["CCPA-delete"]=[];
//     information["Opt-out/in"]=[];
//     information["Privacy Policy"]=[];
//     information["CCPA-only"]=[];
//     const text1=/do not sell|do not share|do not collect/ig
//     const text2=/CCPA.*delete|delete my information|delete-my-information/ig
//     const text3=/opt out|opt in|opt-in|opt-out/ig
//     const text4=/privacy policy|privacy-policy/ig
//     const text5=/CCPA|California Comsumer Privacy Act/ig
//     //const text5=/data collection/ig
    
//     var count = result.length;
//     for(var i = 0; i < count; i++) {
//         var item = result[i];
//         if (typeof item[0] !== "undefined" && (typeof item[2] !== "undefined" || item[1]== 'BUTTON'))
//         {
        
//           if (item[0].match(text1))
//             {
//                 information["Do Not Sell"].push( [item[0],item[1], item[2], item[3]])
//             }
//           else if (item[0].match(text2))
//             {
//                 information["CCPA-delete"].push([item[0],item[1], item[2], item[3]])
//             }
//           else if (item[0].match(text3))
//             {
//                 information["Opt-out/in"].push([item[0],item[1], item[2], item[3]])
//             }
//           else if (item[0].match(text4))
//             {
//                 information["Privacy Policy"].push([item[0],item[1], item[2], item[3]])
//             }
//           else if (item[0].match(text5))
//             {
//                 information["CCPA-only"].push([item[0],item[1], item[2], item[3]])
//             }  
//      }
//     }
//     return information
// }


// var host = window.location.host;

// var attr_list=["ccpa_do_not_sell","ccpa_delete","ccpa_opt_out_in","ccpa_privacy_policy","ccpa_copy"];
// var right_type_list=["CCPADoNotSell","CCPADelete","CCPAOpOutIn","CCPAPrivacyPolicy","CCPACopy"];
// var info_list=["Do Not Sell", "CCPA-delete","Opt-out/in","Privacy Policy","CCPA-only"];

// function update(i,key_word_element){
//     var type=attr_list[i];
//     dict_one_host[type]["text"]=key_word_element[0]; // "Delete my data"
//     dict_one_host[type]["category"]=key_word_element[1]; // "input"
//     if (key_word_element[1]=="A" | key_word_element[1]=="BUTTON" || key_word_element[1]=="input"){
//         dict_one_host[type]["operation_type"]="click"; // "click"
//     } 
//     else {
//         dict_one_host[type]["operation_type"]="text"; // todo
//     }
//     dict_one_host[type]["url"]=key_word_element[2]; // "a9"
//     dict_one_host[type]["html_id"]=key_word_element[3]; // "a9"
// }
// // GetWebsiteAttrRequest will give NULL if none.

// // this is ok, I commit it and make a copy just to check modification
// var dict_one_host= {}; // JSON.parse(GetWebsiteAttrRequest(host));
// // var dict_one_host_origin=JSON.parse(GetWebsiteAttrRequest(host));
// // var dict_one_host = Object.assign({}, dict_one_host_origin);

// // if (!dict_one_host) {
//     // go to website to get attr
    
//     var result=extracttextElements();
//     var all_key_word=filterResult(result);
//     // all_key_word=filterResult_keyword(resultDict);

//     for (let i = 0; i < 5; i++) {
//         if (all_key_word[info_list[i]].length > 0) {
//             dict_one_host[attr_list[i]]={};
//             dict_one_host[attr_list[i]]["right_type"] = right_type_list[i];
//             for (const key_word_element of all_key_word[info_list[i]]) {
//                 update(i, key_word_element);
//                 break;
//             }
//         }
//     }
//     // if (((!("ccpa_do_not_sell" in dict_one_host) && (DNS_key_word.length > 0)))
//     //     ||
//     //     (dict_one_host["ccpa_do_not_sell"]["exercise_path"].length < DNS_key_word.length)
//     // ) {
//     //     dict_one_host["ccpa_do_not_sell"]["right_type"] = "CCPADoNotSell";
//     //     for (const DNS_key_word_element of DNS_key_word) {
//     //         update("ccpa_do_not_sell", DNS_key_word_element);
//     //     }
//     // }

//     // if (dict_one_host_origin===dict_one_host){
//     //     console.log("\n\n\n\n\n !!! --- No change \n\n\n\n\n");
//     // }
//     // dict_one_host_json=JSON.stringify(dict_one_host);
//     // UpdateWebsiteAttrRequest(host,dict_one_host_json);

// // }
// // filterResult(result)
// dict_one_host
// // fetch_page(dict_one_host);


// ~~~~~~


// var host = window.location.host;

// function update(type,key_word_element){
//     dict_one_host[type]["text"]=""; // "Delete my data"
//     dict_one_host[type]["category"]=""; // "input"
//     dict_one_host[type]["operation_type"]=""; // "click"
//     dict_one_host[type]["html_id"]=""; // "a9"
// }
// // GetWebsiteAttrRequest will give NULL if none.
// var attr_list=["ccpa_do_not_sell","ccpa_delete","ccpa_copy","ccpa_privacy_policy"];
// var right_type_list=["CCPADoNotSell","CCPADelete","CCPACopy","CCPAPrivacyPolicy"];
// var info_list=["Do Not Sell", "CCPA-delete","Opt-out/in","Privacy Policy","CCPA-only"];

// // this is ok, I commit it and make a copy just to check modification
// // var dict_one_host=JSON.parse(GetWebsiteAttrRequest(host));
// var dict_one_host_origin=JSON.parse(GetWebsiteAttrRequest(host));
// var dict_one_host = Object.assign({}, dict_one_host_origin);

// if (!(("ccpa_do_not_sell" in dict_one_host) && ("ccpa_delete" in dict_one_host) && ("ccpa_copy" in dict_one_host))) {
//     // go to website to get attr
//     var result=extracttextElements();
//     filterResult(result);
//     all_key_word=filterResult(result);
//     // all_key_word=filterResult_keyword(resultDict);

//     for (let i = 0; i < 5; i++) {
//         if (((!(attr_list[i] in dict_one_host) && (all_key_word[info_list[i]].length > 0)))
//             ||
//             (dict_one_host[attr_list[i]]["exercise_path"].length < all_key_word[i].length)
//         ) {
//             dict_one_host[attr_list[i]]["right_type"] = right_type_list[i];
//             for (const key_word_element of all_key_word[i]) {
//                 update(attr_list[i], key_word_element);
//             }
//         }
//     }
//     // if (((!("ccpa_do_not_sell" in dict_one_host) && (DNS_key_word.length > 0)))
//     //     ||
//     //     (dict_one_host["ccpa_do_not_sell"]["exercise_path"].length < DNS_key_word.length)
//     // ) {
//     //     dict_one_host["ccpa_do_not_sell"]["right_type"] = "CCPADoNotSell";
//     //     for (const DNS_key_word_element of DNS_key_word) {
//     //         update("ccpa_do_not_sell", DNS_key_word_element);
//     //     }
//     // }

//     if (dict_one_host_origin===dict_one_host){
//         console.log("\n\n\n\n\n !!! --- No change \n\n\n\n\n");
//     }
//     dict_one_host_json=JSON.stringify(dict_one_host);
//     UpdateWebsiteAttrRequest(host,dict_one_host_json);

// }

// fetch_page(dict_one_host);

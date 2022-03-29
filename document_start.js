function extracttextElements(){
    var elemTextList=[];
    var dict = new Object();
    var  elems=document.getElementsByTagName("*");
    for(var i=0;i<elems.length;i++){
    elemTextList.push([elems[i].textContent,elems[i].tagName, elems[i].href, elems[i].id])
    }
    return elemTextList
}

extracttextElements()

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
filterResult(extracttextElements())

function generate_json() {
    // var host = window.location.host;
    var attr_list = ["ccpa_do_not_sell", "ccpa_delete", "ccpa_opt_out_in", "ccpa_privacy_policy", "ccpa_copy"];
    var right_type_list = ["CCPADoNotSell", "CCPADelete", "CCPAOpOutIn", "CCPAPrivacyPolicy", "CCPACopy"];
    var info_list = ["Do Not Sell", "delete information", "Opt-out/in", "Privacy Policy", "CCPA-only"];
    var dict_one_host = new Object();
    var result = extracttextElements();
    var all_key_word = filterResult(result);
    
    function update(i, j, key_word_element) {
        var type = attr_list[i];
        dict_one_host[type][j]= new Object();
        dict_one_host[type][j]["text"] = key_word_element[3]; // "Delete my data"
        dict_one_host[type][j]["category"] = key_word_element[0]; // "input"
        if (key_word_element[0] === "A" || key_word_element[0] === "BUTTON" || key_word_element[0] === "input") {
            dict_one_host[type][j]["operation_type"] = "click"; // "click"
        } else {
            dict_one_host[type][j]["operation_type"] = "text"; // todo
        }
        dict_one_host[type][j]["url"] = key_word_element[1];
        dict_one_host[type][j]["html_id"] = key_word_element[2];
    }


    for (let i = 0; i < 5; i++) {
        if (all_key_word[info_list[i]].length > 0) {
            dict_one_host[attr_list[i]] = new Object();
            dict_one_host[attr_list[i]]["right_type"] = right_type_list[i];
            // for (const key_word_element of all_key_word[info_list[i]]) {
            var count=all_key_word[info_list[i]].length
            for (let k = 0; k< count; k++) {
                update(i, k, all_key_word[info_list[i]][k]);
            }
        }
    }
    return dict_one_host;
}

generate_json()


async function useOptOut(JSONDict){
    //await sleep(5000);
    //const text=/http/ig
    var final =[];
    function update_result(category)
    {
        var result = new Object();
        if (JSONDict[category]!= undefined )
        {
            result[category]=new Object();
            result[category]['url']=[];
            //result[category]['text']=[];
            var keys = Object.keys(JSONDict[category]);
            count=keys.length-1
            for (let i = 0; i < count; i++)
            {
                if(JSONDict[category][i]['url']!= undefined)
                {
                    result[category]['url'].push(JSONDict[category][i]['url'])
                }
        
                //if(JSONDict[category][i]['text']!= undefined)
                //{
                    //result[category]['text'].push(JSONDict[category][i]['text'])
                //}
            }
        }
        return result
    }

    final.push(update_result("ccpa_do_not_sell"))
    //console.log(result)
    //if (result["ccpa_do_not_sell"]){
        //return result;
    //}
    final.push(update_result("ccpa_opt_out_in"))
    //console.log(result)
    //if (result["ccpa_opt_out_in"]){
        //return result;
    //}
    //update_result("ccpa_delete")
    //if (result["ccpa_delete"]){
        //return result;
    //}
    //update_result("ccpa_privacy_policy")
    final.push(update_result("ccpa_delete"))
    final.push(update_result("ccpa_privacy_policy"))
    final.push(update_result("ccpa_copy"))
    //if (result["ccpa_privacy_policy"]){
        //return result;
    //}
    //console.log(result)
    //update_result("ccpa_copy")
    if (final){
        return final;
    }
    return null;

}